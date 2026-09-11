'use client';

import React, { useId } from 'react';
import { 
  Fuel, 
  Clock, 
  Droplets, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCommodities, CommodityItem, CommoditiesData } from '@/lib/api';

/**
 * Gera os pontos de curva SVG dinâmicos a partir de um array numérico
 */
function generateSvgPath(points: number[], width = 280, height = 55): { pathD: string; areaD: string } {
  if (!points || points.length < 2) {
    return {
      pathD: `M 0,${height / 2} L ${width},${height / 2}`,
      areaD: `M 0,${height / 2} L ${width},${height / 2} L ${width},${height} L 0,${height} Z`,
    };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = 6;
  const usableHeight = height - padding * 2;

  const coords = points.map((p, i) => {
    const x = Number(((i / (points.length - 1)) * width).toFixed(1));
    const y = Number((height - padding - ((p - min) / range) * usableHeight).toFixed(1));
    return `${x},${y}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return { pathD, areaD };
}

export function CommoditiesTestTicker() {
  const chartId = useId();

  // Consulta ao backend com cache inteligente de 15 minutos no navegador
  const { data: serverData, isLoading } = useQuery<CommoditiesData | null>({
    queryKey: ['commoditiesRates'],
    queryFn: fetchCommodities,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 30,
  });

  const isAvailable = Boolean(serverData?.isAvailable && serverData?.items && serverData.items.length > 0);
  const items: CommodityItem[] = isAvailable ? (serverData?.items || []) : [];
  const usdToBrl = serverData?.usdToBrl;

  // Formatação amigável de horários
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const lastUpdatedTime = formatTime(serverData?.updatedAt);

  return (
    <section className="w-full bg-slate-50 border-y border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho do Componente */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-500 mt-0.5">
              Balizadores de Petróleo, Diesel e Soja com conversão cambial direta para o agronegócio
            </p>
          </div>

          {/* Status e Câmbio de Referência */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${usdToBrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'} shrink-0`} />
              <span>
                Dólar Comercial:{' '}
                <strong>
                  {usdToBrl
                    ? `R$ ${usdToBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : 'Não é possível buscar a cotação no momento'}
                </strong>
              </span>
            </div>

            {lastUpdatedTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Última cotação: <strong>{lastUpdatedTime}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Dinâmico: Cards reais se a API estiver disponível, ou mensagem de Cotação Não Disponível */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center gap-2 mb-5 shadow-2xs animate-pulse">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Carregando cotações de mercado...</span>
          </div>
        ) : isAvailable ? (
          /* Grid dos 4 Cards de Commodities com dados reais da API */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {items.map((item: CommodityItem) => {
              const { pathD, areaD } = generateSvgPath(item.history || []);
              const isPos = item.isPositive;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
                >
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.symbol} • USD: ${item.priceUsd.toFixed(2)} {item.unitOriginal}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      Ao Vivo
                    </span>
                  </div>

                  {/* Valor Convertido em Reais (R$) */}
                  <div className="my-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-slate-400">R$</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {item.priceBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">{item.unitBrl}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-xs font-bold flex items-center gap-0.5 ${
                          isPos ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {item.change}
                      </span>
                      {usdToBrl && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          • Câmbio: R$ {usdToBrl.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mini Gráfico SVG Fluido */}
                  <div className="w-full h-[55px] pt-1 relative">
                    <svg viewBox="0 0 280 55" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id={`${chartId}-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="0%" 
                            stopColor={isPos ? '#16a34a' : '#d97706'} 
                            stopOpacity="0.25" 
                          />
                          <stop 
                            offset="100%" 
                            stopColor={isPos ? '#16a34a' : '#d97706'} 
                            stopOpacity="0.0" 
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d={areaD}
                        fill={`url(#${chartId}-${item.id})`}
                      />
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isPos ? '#16a34a' : '#d97706'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Quando a API não estiver disponível: exibe mensagem clara sem usar valores de fallback */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center gap-3 mb-5 shadow-2xs">
            <div className="p-3 bg-slate-100 rounded-full text-slate-500 border border-slate-200">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Não é possível buscar a cotação no momento</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                As cotações do mercado estão temporariamente indisponíveis. A atualização será restabelecida assim que os dados estiverem disponíveis.
              </p>
            </div>
          </div>
        )}

       

      </div>
    </section>
  );
}

export const OilTicker = CommoditiesTestTicker;
export default CommoditiesTestTicker;