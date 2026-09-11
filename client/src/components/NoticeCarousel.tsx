'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { Notice, fetchActiveNotices, formatImageUrl } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_NOTICES } from '@/data/fallbackData';

export default function NoticeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['activeNotices'],
    queryFn: fetchActiveNotices,
    staleTime: 1000 * 60 * 2,
  });

  const notices: Notice[] =
    noticesData && noticesData.length > 0
      ? noticesData
      : (FALLBACK_NOTICES as Notice[]);

  const total = notices.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay a cada 7 segundos se houver mais de um aviso
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, total]);

  if (isLoading) {
    return (
      <section id="avisos" className="py-6 sm:py-8 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-1.5 h-6 rounded-full" />
              <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              <div className="md:col-span-6 lg:col-span-7">
                <Skeleton className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl" />
              </div>
              <div className="md:col-span-6 lg:col-span-5 space-y-4">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-10 w-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentIndex] || notices[0];
  const photoUrl = formatImageUrl(currentNotice.imageUrl, FALLBACK_NOTICES[0]?.imageUrl || '/images/agro-harvest.jpg');
  const descriptionText = currentNotice.description || currentNotice.message || '';

  return (
    <section id="avisos" className="py-6 sm:py-8 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Limpo da Seção */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className='text-4xl'>Quadro de Avisos</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Notícias & Comunicados
              </span>
            </h2>
          </div>

          {/* Contador de avisos se houver mais de um */}
          {notices.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono font-bold">
                {currentIndex + 1} de {notices.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Aviso anterior"
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Próximo aviso"
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <ScrollReveal direction="up" distance={15}>
          {/* Card Editorial com Foto em Grande Destaque (Estilo da Foto de Referência) */}
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400/60 hover:shadow-md transition-all duration-300 p-5 sm:p-7 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Lado da Foto: Grande Destaque Visual */}
              <div className="md:col-span-6 lg:col-span-7">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xs group">
                  <img
                    src={photoUrl}
                    alt={currentNotice.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback elegante caso a URL quebre
                      (e.target as HTMLImageElement).src = '/images/agro-harvest.jpg';
                    }}
                  />
                  {/* Gradiente sutil nas bordas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Lado do Conteúdo: Manchete Editorial + Descrição + Botão de Ação */}
              <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center space-y-3">
                
                {/* Kicker sutil (estilo o da foto de referência) */}
                <div className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
                  Comunicado Oficial
                </div>

                {/* Manchete / Título com Tipografia de Notícia Marcante */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {currentNotice.title}
                </h3>

                {/* Descrição / Texto */}
                {descriptionText && (
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                    {descriptionText}
                  </p>
                )}

                {/* Botão de Ação (se cadastrado) */}
                {currentNotice.linkUrl && (
                  <div className="pt-3">
                    <a
                      href={currentNotice.linkUrl}
                      target={currentNotice.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-all active:scale-95"
                    >
                      <span>{currentNotice.linkText || 'Acessar Detalhes'}</span>
                      {currentNotice.linkUrl.startsWith('http') ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </a>
                  </div>
                )}

              </div>

            </div>

            {/* Linha de Progresso / Indicador se houver múltiplos avisos */}
            {notices.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-5 mt-5 border-t border-slate-100">
                {notices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir para aviso ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-amber-500'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
