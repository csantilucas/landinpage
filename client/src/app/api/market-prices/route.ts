import { NextResponse } from 'next/server';

// Força revalidação no cache da Vercel / Next.js a cada 1 hora (3600 segundos)
export const revalidate = 3600;

interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  history: number[];
}

async function fetchYahooQuote(symbol: string): Promise<YahooQuote | null> {
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
        next: { revalidate: 3600 },
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
    } catch {
      // Tenta a próxima URL
    }
  }

  return null;
}

export async function GET() {
  try {
    const [brentQuote, wtiQuote, dieselQuote, sojaQuote, usdQuote] = await Promise.all([
      fetchYahooQuote('BZ=F'),
      fetchYahooQuote('CL=F'),
      fetchYahooQuote('HO=F'),
      fetchYahooQuote('ZS=F'),
      fetchYahooQuote('USDBRL=X'),
    ]);

    const usdRate = usdQuote?.regularMarketPrice && usdQuote.regularMarketPrice > 0
      ? Number(usdQuote.regularMarketPrice.toFixed(4))
      : 0;

    const calcChange = (price: number, prevClose: number) => {
      if (!prevClose || prevClose <= 0) return { change: '0.00%', isPositive: true };
      const diff = ((price - prevClose) / prevClose) * 100;
      const isPositive = diff >= 0;
      return {
        change: `${isPositive ? '+' : ''}${diff.toFixed(2)}%`,
        isPositive,
      };
    };

    const items = [];

    // 1. Diesel Refinado (HO=F - Heating Oil NYMEX)
    if (dieselQuote && dieselQuote.regularMarketPrice > 0) {
      const priceUsd = Number(dieselQuote.regularMarketPrice.toFixed(4));
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
      const rawSoja = sojaQuote.regularMarketPrice;
      const priceUsd = Number((rawSoja > 100 ? rawSoja / 100 : rawSoja).toFixed(2));
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

    const now = new Date();
    const nextUpdateAt = new Date(now.getTime() + 3600 * 1000);

    return NextResponse.json({
      success: true,
      data: {
        items,
        usdToBrl: usdRate,
        updatedAt: now.toISOString(),
        nextUpdateAt: nextUpdateAt.toISOString(),
        source: 'yahoo-finance',
        isStale: false,
        isAvailable: items.length > 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Falha ao obter cotações do Yahoo Finance',
        data: {
          items: [],
          usdToBrl: 0,
          updatedAt: new Date().toISOString(),
          isAvailable: false,
          message: 'Não é possível buscar a cotação no momento',
        },
      },
      { status: 500 }
    );
  }
}
