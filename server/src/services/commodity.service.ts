import { ENV } from '../config/env.js';
import { CommodityRepository } from '../repositories/commodity.repository.js';
import { CommodityItem, CommoditiesData, CommoditiesCacheDocument } from '../models/commodity.model.js';

interface YahooChartQuote {
  symbol: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  history: number[];
}

export class CommodityService {
  private repository = new CommodityRepository();
  private timer: NodeJS.Timeout | null = null;
  private inFlightPromise: Promise<CommoditiesData> | null = null;

  /**
   * Busca dados de cotação e histórico recente no Yahoo Finance (Gratuito e Aberto)
   */
  private async fetchYahooChart(symbol: string): Promise<YahooChartQuote | null> {
    const urls = [
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(6000),
        });

        if (!res.ok) continue;

        const json = await res.json();
        const result = json.chart?.result?.[0];
        if (!result) continue;

        const meta = result.meta;
        const closes = result.indicators?.quote?.[0]?.close || [];
        const cleanHistory = closes.filter((v: any) => typeof v === 'number' && !isNaN(v));

        return {
          symbol,
          regularMarketPrice: meta?.regularMarketPrice || 0,
          chartPreviousClose: meta?.chartPreviousClose || meta?.regularMarketPrice || 0,
          history: cleanHistory.length > 0 ? cleanHistory : [meta?.regularMarketPrice || 0],
        };
      } catch (err) {
        // Tenta a próxima URL de fallback
      }
    }

    console.warn(`[CommodityService] Não foi possível consultar ${symbol} no Yahoo Finance.`);
    return null;
  }

  /**
   * Busca a cotação oficial do Dólar Comercial (USD/BRL) via AwesomeAPI (fallback adicional)
   */
  async fetchUsdToBrl(): Promise<number> {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL', {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.USDBRL?.bid) {
          const bid = parseFloat(json.USDBRL.bid);
          if (!isNaN(bid) && bid > 0) return bid;
        }
      }
    } catch (err) {
      console.warn('[CommodityService] Fallback AwesomeAPI Dólar indisponível:', err);
    }
    return 0;
  }

  /**
   * Obtém as cotações de mercado.
   * Utiliza cache em MongoDB com TTL de 1 hora para máxima performance e persistência em Serverless.
   */
  async getCommodities(forceRefresh = false): Promise<CommoditiesData> {
    const ttlMinutes = ENV.COMMODITIES_CACHE_TTL_MINUTES || 60;
    const ttlMs = ttlMinutes * 60 * 1000;
    const now = new Date();

    const cached = await this.repository.getLatest();

    // Se o cache é válido e não é um refresh forçado, retorna o cache diretamente do MongoDB
    if (cached && !forceRefresh) {
      const ageMs = now.getTime() - new Date(cached.updatedAt).getTime();
      if (ageMs < ttlMs && cached.items && cached.items.length > 0) {
        return {
          items: cached.items,
          usdToBrl: cached.usdToBrl,
          updatedAt: new Date(cached.updatedAt).toISOString(),
          nextUpdateAt: new Date(cached.nextUpdateAt).toISOString(),
          source: 'cache',
          isStale: false,
          isAvailable: true,
        };
      }
    }

    // Mutex lock: se já existe uma requisição em andamento, aguarda e compartilha o resultado
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    this.inFlightPromise = this.executeRefresh(cached, now, ttlMs).finally(() => {
      this.inFlightPromise = null;
    });

    return this.inFlightPromise;
  }

  private async executeRefresh(
    cached: CommoditiesCacheDocument | null,
    now: Date,
    ttlMs: number
  ): Promise<CommoditiesData> {
    try {
      console.log('[CommodityService] Buscando cotações em tempo real no Yahoo Finance (BZ=F, CL=F, HO=F, ZS=F, USDBRL=X)...');

      // Consulta os 5 ativos em paralelo
      const [brentQuote, wtiQuote, dieselQuote, sojaQuote, usdQuote] = await Promise.all([
        this.fetchYahooChart('BZ=F'),
        this.fetchYahooChart('CL=F'),
        this.fetchYahooChart('HO=F'),
        this.fetchYahooChart('ZS=F'),
        this.fetchYahooChart('USDBRL=X'),
      ]);

      // Câmbio de referência Dólar Comercial
      const usdRate = usdQuote?.regularMarketPrice && usdQuote.regularMarketPrice > 0
        ? Number(usdQuote.regularMarketPrice.toFixed(4))
        : await this.fetchUsdToBrl();

      // Se todas as cotações falharem, preserva cache se houver
      if (!brentQuote && !wtiQuote && !dieselQuote && !sojaQuote) {
        if (cached && cached.items && cached.items.length > 0) {
          return {
            items: cached.items,
            usdToBrl: usdRate,
            updatedAt: new Date(cached.updatedAt).toISOString(),
            nextUpdateAt: new Date(now.getTime() + ttlMs).toISOString(),
            source: 'cache',
            isStale: true,
            isAvailable: true,
          };
        }

        return {
          items: [],
          usdToBrl: usdRate,
          updatedAt: now.toISOString(),
          nextUpdateAt: new Date(now.getTime() + ttlMs).toISOString(),
          source: 'fallback',
          isStale: true,
          isAvailable: false,
          message: 'Cotação não disponível',
        };
      }

      // Função auxiliar de cálculo de variação percentual
      const calcChange = (price: number, prevClose: number): { change: string; isPositive: boolean } => {
        if (!prevClose || prevClose <= 0) return { change: '0.00%', isPositive: true };
        const diff = ((price - prevClose) / prevClose) * 100;
        const isPositive = diff >= 0;
        return {
          change: `${isPositive ? '+' : ''}${diff.toFixed(2)}%`,
          isPositive,
        };
      };

      const items: CommodityItem[] = [];

      // 1. Diesel Refinado (HO=F - Heating Oil NYMEX / ULSD proxy)
      if (dieselQuote && dieselQuote.regularMarketPrice > 0) {
        const priceUsd = Number(dieselQuote.regularMarketPrice.toFixed(4));
        // 1 galão americano = ~3.78541 litros
        const priceBrl = Number(((priceUsd / 3.78541) * usdRate).toFixed(2));
        const { change, isPositive } = calcChange(priceUsd, dieselQuote.chartPreviousClose);
        const history = (dieselQuote.history || []).map((p) => Number(((p / 3.78541) * usdRate).toFixed(2)));

        items.push({
          id: 'diesel',
          name: 'Diesel Refinado',
          symbol: 'HO=F',
          category: 'fuel',
          unitOriginal: 'US$/gal',
          unitBrl: 'R$/L ref.',
          priceUsd,
          priceBrl,
          change,
          isPositive,
          history: history.length > 0 ? history : [priceBrl],
        });
      }

      // 2. Petróleo Brent (BZ=F)
      if (brentQuote && brentQuote.regularMarketPrice > 0) {
        const priceUsd = Number(brentQuote.regularMarketPrice.toFixed(2));
        const priceBrl = Number((priceUsd * usdRate).toFixed(2));
        const { change, isPositive } = calcChange(priceUsd, brentQuote.chartPreviousClose);
        const history = (brentQuote.history || []).map((p) => Number((p * usdRate).toFixed(2)));

        items.push({
          id: 'brent',
          name: 'Petróleo Brent',
          symbol: 'BZ=F',
          category: 'oil',
          unitOriginal: 'US$/barril',
          unitBrl: 'R$/barril',
          priceUsd,
          priceBrl,
          change,
          isPositive,
          history: history.length > 0 ? history : [priceBrl],
        });
      }

      // 3. Petróleo WTI (CL=F)
      if (wtiQuote && wtiQuote.regularMarketPrice > 0) {
        const priceUsd = Number(wtiQuote.regularMarketPrice.toFixed(2));
        const priceBrl = Number((priceUsd * usdRate).toFixed(2));
        const { change, isPositive } = calcChange(priceUsd, wtiQuote.chartPreviousClose);
        const history = (wtiQuote.history || []).map((p) => Number((p * usdRate).toFixed(2)));

        items.push({
          id: 'wti',
          name: 'Petróleo WTI',
          symbol: 'CL=F',
          category: 'oil',
          unitOriginal: 'US$/barril',
          unitBrl: 'R$/barril',
          priceUsd,
          priceBrl,
          change,
          isPositive,
          history: history.length > 0 ? history : [priceBrl],
        });
      }

      // 4. Soja em Grãos (ZS=F - CBOT)
      if (sojaQuote && sojaQuote.regularMarketPrice > 0) {
        // Cotação da CBOT vem em centavos de dólar por bushel (ex: 1310 = 13.10 US$/bu)
        const rawSoja = sojaQuote.regularMarketPrice;
        const priceUsd = Number((rawSoja > 100 ? rawSoja / 100 : rawSoja).toFixed(2));
        // 1 saca de 60kg = 2.20462 bushels
        const priceBrl = Number((priceUsd * 2.20462 * (usdRate * 0.98)).toFixed(2));
        const { change, isPositive } = calcChange(rawSoja, sojaQuote.chartPreviousClose);
        const history = (sojaQuote.history || []).map((p) => {
          const u = p > 100 ? p / 100 : p;
          return Number((u * 2.20462 * (usdRate * 0.98)).toFixed(2));
        });

        items.push({
          id: 'soja',
          name: 'Soja em Grãos',
          symbol: 'ZS=F',
          category: 'agro',
          unitOriginal: 'US$/bu',
          unitBrl: 'R$/sc ref.',
          priceUsd,
          priceBrl,
          change,
          isPositive,
          history: history.length > 0 ? history : [priceBrl],
        });
      }

      const nextUpdateAt = new Date(now.getTime() + ttlMs);

      // Salva no MongoDB para compartilhar entre requisições
      await this.repository.saveLatest({
        items,
        usdToBrl: usdRate,
        updatedAt: now,
        nextUpdateAt,
        source: 'commodities-api',
      });

      console.log(`[CommodityService] Cotações Yahoo Finance atualizadas com sucesso! (${items.length} ativos)`);

      return {
        items,
        usdToBrl: usdRate,
        updatedAt: now.toISOString(),
        nextUpdateAt: nextUpdateAt.toISOString(),
        source: 'commodities-api',
        isStale: false,
        isAvailable: items.length > 0,
      };
    } catch (error: any) {
      console.error('[CommodityService] Erro ao sincronizar Yahoo Finance:', error?.message || error);

      if (cached && cached.items && cached.items.length > 0) {
        return {
          items: cached.items,
          usdToBrl: cached.usdToBrl,
          updatedAt: new Date(cached.updatedAt).toISOString(),
          nextUpdateAt: new Date(cached.nextUpdateAt).toISOString(),
          source: 'cache',
          isStale: true,
          isAvailable: true,
        };
      }

      const usdRate = await this.fetchUsdToBrl();
      return {
        items: [],
        usdToBrl: usdRate,
        updatedAt: now.toISOString(),
        nextUpdateAt: new Date(now.getTime() + ttlMs).toISOString(),
        source: 'fallback',
        isStale: true,
        isAvailable: false,
        message: 'Não é possível buscar a cotação no momento',
      };
    }
  }

  /**
   * Inicia o agendador de atualização automática em segundo plano (a cada 1 hora)
   */
  startScheduledSync(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const intervalMinutes = ENV.COMMODITIES_CACHE_TTL_MINUTES || 60;
    const intervalMs = intervalMinutes * 60 * 1000;

    console.log(`[CommodityService] Agendador Yahoo Finance ativo: sincronização a cada ${intervalMinutes} minutos.`);

    // Sincronização inicial
    this.getCommodities(false).catch((err) => {
      console.warn('[CommodityService] Aviso no sync inicial Yahoo Finance:', err?.message || err);
    });

    // Ciclo horário
    this.timer = setInterval(async () => {
      console.log('[CommodityService] Executando ciclo horário de atualização de cotações...');
      try {
        await this.getCommodities(true);
      } catch (err: any) {
        console.warn('[CommodityService] Falha no ciclo horário:', err?.message || err);
      }
    }, intervalMs);
  }

  stopScheduledSync(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const commodityService = new CommodityService();
