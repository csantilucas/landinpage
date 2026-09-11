'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveBanners, BannerItem, formatImageUrl } from '@/lib/api';

const DEFAULT_BANNER: BannerItem = {
  _id: 'default-1',
  title: 'TRR KRUPINSKI',
  description: 'Entregando qualidade a mais de 30 anos',
  imageUrl: '/images/Gemini_Generated_Image_ywuiheywuiheywui.jpg',
  order: 1,
  active: true,
  linkUrl: '#sobre',
  linkText: 'Conheça Nossa História',
};

interface BannerCarouselProps {
  initialBanners?: BannerItem[];
  isEditable?: boolean;
}

export default function BannerCarousel({ initialBanners, isEditable = false }: BannerCarouselProps) {
  const { data: apiBanners } = useQuery({
    queryKey: ['activeBanners'],
    queryFn: fetchActiveBanners,
    staleTime: 1000 * 60 * 2,
    enabled: !initialBanners,
  });

  const banners = (initialBanners || apiBanners?.length ? (initialBanners || apiBanners) : [DEFAULT_BANNER]) as BannerItem[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play de 6 segundos
  useEffect(() => {
    if (total <= 1 || isPaused || isEditable) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide, isEditable]);

  const currentBanner = banners[currentIndex] || DEFAULT_BANNER;
  const bannerImage = formatImageUrl(currentBanner.imageUrl, DEFAULT_BANNER.imageUrl);

  return (
    <section
      className="relative w-full h-[85vh] min-h-[560px] max-h-[920px] overflow-hidden bg-slate-100 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banner Principal da TRR Krupinski"
    >
      {/* Imagem de Fundo (100% natural, sem filtros ou camadas escuras) */}
      {banners.map((banner, idx) => {
        const isActive = idx === currentIndex;
        const imgUrl = formatImageUrl(banner.imageUrl, DEFAULT_BANNER.imageUrl);
        return (
          <div
            key={banner._id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            style={{
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        );
      })}

      {/* Conteúdo do Banner: Canto Superior Esquerdo com Padding, alinhado à esquerda */}
      <div className="relative z-30 max-w-7xl mx-auto h-full flex flex-col justify-start items-start pt-28 sm:pt-36 md:pt-40 px-6 sm:px-12 lg:px-16">
        <div className="max-w-3xl text-left">
          
          {/* Título Principal com Sombra Limpa */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg tracking-tight leading-[1.08]">
            {currentBanner.title}
          </h1>

          {/* Descrição com Sombra Limpa */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg leading-relaxed max-w-2xl">
            {currentBanner.description}
          </p>

          {/* Botão de Ação Opcional */}
          {currentBanner.linkUrl && (
            <div className="pt-2">
              <a
                href={currentBanner.linkUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95"
              >
                <span>{currentBanner.linkText || 'Saiba Mais'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>
      </div>

      {/* Controles de Navegação (Anterior / Próximo) - exibidos se houver mais de 1 banner */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Banner anterior"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/75 hover:bg-white text-slate-900 border border-slate-200/80 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próximo banner"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/75 hover:bg-white text-slate-900 border border-slate-200/80 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores de Slide (Bolinhas no rodapé do banner) */}
          <div className="absolute bottom-6 left-6 sm:left-12 lg:left-16 z-30 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para banner ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-amber-500 shadow-md'
                    : 'w-2.5 bg-slate-600/40 hover:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
