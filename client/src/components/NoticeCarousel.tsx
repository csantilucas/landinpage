'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Info,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { Notice, fetchActiveNotices } from '@/lib/api';

const DEFAULT_NOTICES: Notice[] = [
  {
    _id: 'notice-1',
    title: 'Plantão Safra 2026 Ativo',
    message:
      'Abastecimento in loco prioritário para colheitadeiras e frotas agrícolas em Vilhena, Comodoro, Campo Novo e Aripuanã.',
    type: 'alert',
    active: true,
    priority: 0,
    linkUrl:
      'https://wa.me/556933221100?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20abastecimento%20de%20safra.',
    linkText: 'Solicitar Abastecimento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'notice-2',
    title: 'Abastecimento Programado para a Safra',
    message:
      'Entregas programadas de Diesel S-10 e S-500 diretamente na sua propriedade com medição digital e pontualidade máxima.',
    type: 'info',
    active: true,
    priority: 0,
    linkUrl: '#produtos',
    linkText: 'Ver Produtos e Serviços',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function NoticeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['activeNotices'],
    queryFn: fetchActiveNotices,
    staleTime: 1000 * 60 * 2,
  });

  const notices: Notice[] =
    noticesData && noticesData.length > 0 ? noticesData : DEFAULT_NOTICES;
  const total = notices.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, total]);

  if (isLoading || notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentIndex] || notices[0];

  const getTypeTheme = (type: Notice['type']) => {
    switch (type) {
      case 'alert':
        return {
          badgeBg: 'bg-amber-100/80 text-amber-900 border-amber-300',
          badgeText: 'Alerta / Plantão',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          accentBar: 'bg-amber-500',
        };
      case 'warning':
        return {
          badgeBg: 'bg-amber-100/80 text-amber-900 border-amber-300',
          badgeText: 'Comunicado Importante',
          icon: <Bell className="w-4 h-4 text-amber-600" />,
          accentBar: 'bg-amber-500',
        };
      case 'success':
        return {
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badgeText: 'Informativo',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          accentBar: 'bg-emerald-500',
        };
      case 'info':
      default:
        return {
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          badgeText: 'Aviso Oficial',
          icon: <Info className="w-4 h-4 text-slate-600" />,
          accentBar: 'bg-slate-400',
        };
    }
  };

  const theme = getTypeTheme(currentNotice.type);

  return (
    <section
      id="avisos"
      className="py-5 bg-transparent overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título Notícias */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Notícias</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Avisos & Comunicados
              </span>
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Atualizações operacionais e comunicados da safra
          </span>
        </div>

        <ScrollReveal direction="up" distance={15}>
          <div
            className="relative bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs hover:border-amber-400/50 transition-all duration-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Linha de acento sutil no topo do card */}
            <div className={`absolute top-0 left-6 right-6 h-0.5 ${theme.accentBar} rounded-full`} />

            {/* Cabeçalho do aviso */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  {theme.icon}
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${theme.badgeBg}`}
                >
                  {theme.badgeText}
                </span>
                <span className="text-xs text-slate-400 ml-1 hidden sm:inline">
                  • Plantão & Comunicados Oficiais
                </span>
              </div>

              <div className="flex items-center gap-2">
                {notices.length > 1 && (
                  <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-600">
                    <span>{currentIndex + 1}</span>
                    <span className="text-slate-400">/</span>
                    <span>{notices.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo Central */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              {/* Imagem do Aviso se cadastrada */}
              {currentNotice.imageUrl && (
                <div className="relative w-full md:w-36 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-xs">
                  <img
                    src={currentNotice.imageUrl}
                    alt={currentNotice.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-1.5 max-w-3xl flex-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentNotice.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentNotice.message}
                </p>
              </div>

              {/* Botão de Ação */}
              {currentNotice.linkUrl && (
                <div className="shrink-0 pt-2 md:pt-0">
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

            {/* Controles de Navegação (se houver mais de 1 aviso) */}
            {notices.length > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Aviso anterior"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Próximo aviso"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {notices.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Ir para aviso ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-5 bg-amber-500'
                          : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
