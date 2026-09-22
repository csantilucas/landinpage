'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchActiveFleet, formatImageUrl } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_FLEET_ITEMS } from '@/data/fallbackData';

export interface FleetItem {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

export default function FleetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // TanStack Query para carregar a frota com cache otimizado
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 5,
  });

  const items: FleetItem[] = useMemo(() => {
    if (isLoading) return [];
    if (fleetData && fleetData.length > 0) {
      const carouselItems = fleetData.filter(
        (d) => !d.category || d.category === 'carrossel'
      );
      if (carouselItems.length > 0) {
        return carouselItems.map((d, i) => ({
          id: i + 1,
          src: formatImageUrl(d.imageUrl),
          title: d.title,
          subtitle: d.description || 'Abastecimento com qualidade e segurança TRR Krupinski',
        }));
      }
    }
    // Fallback estrito quando a query finalizou sem dados
    return FALLBACK_FLEET_ITEMS;
  }, [fleetData, isLoading]);

  const total = items.length || 1;

  const nextSlide = useCallback(() => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback(
    (index: number) => {
      setSlideDirection(index > currentIndex ? 'right' : 'left');
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Autoplay a cada 5.5 segundos
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, total]);

  // Touch Swipe para dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (isLoading) {
    return (
      <section id="frota" className="py-20 bg-slate-100/60 border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
            <Skeleton className="h-6 w-64 rounded-md mb-2" />
            <Skeleton className="h-9 sm:h-10 w-80 sm:w-96 rounded-xl mt-2" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md mt-4" />
            <Skeleton className="h-4 w-4/5 max-w-lg rounded-md mt-2" />
          </div>

          {/* Carousel Showcase Skeleton */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 select-none">
            {/* Slot -2: Far Left Pill */}
            <div className="hidden lg:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-14 xl:w-20 rounded-full overflow-hidden shrink-0">
              <Skeleton className="w-full h-full rounded-full" />
            </div>

            {/* Slot -1: Near Left Pill */}
            <div className="hidden md:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-20 sm:w-24 lg:w-32 rounded-full overflow-hidden shrink-0">
              <Skeleton className="w-full h-full rounded-full" />
            </div>

            {/* Slot 0: Center Hero Card */}
            <div className="relative h-[320px] sm:h-[380px] lg:h-[440px] w-full max-w-[660px] lg:max-w-[720px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200/80 shrink-0">
              <Skeleton className="w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
                <Skeleton className="h-7 sm:h-8 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            </div>

            {/* Slot +1: Near Right Pill */}
            <div className="hidden md:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-20 sm:w-24 lg:w-32 rounded-full overflow-hidden shrink-0">
              <Skeleton className="w-full h-full rounded-full" />
            </div>

            {/* Slot +2: Far Right Pill */}
            <div className="hidden lg:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-14 xl:w-20 rounded-full overflow-hidden shrink-0">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          </div>

          {/* Bottom Indicators Skeleton */}
          <div className="mt-8 flex items-center justify-between max-w-3xl mx-auto px-4">
            <div className="flex gap-2">
              <Skeleton className="h-2 w-8 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  // Função auxiliar para obter item em offset circular relativo ao centro
  const getItemAtOffset = (offset: number) => {
    const idx = (currentIndex + offset + total) % total;
    return { item: items[idx], index: idx };
  };

  const farLeft = getItemAtOffset(-2);
  const nearLeft = getItemAtOffset(-1);
  const center = getItemAtOffset(0);
  const nearRight = getItemAtOffset(1);
  const farRight = getItemAtOffset(2);

  return (
    <section id="frota" className="py-20 bg-slate-100/60 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Content */}
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3.5 py-1 rounded-md mb-2 border border-amber-200">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Frota Própria & Logística Especializada</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Conheça Nossa Frota
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
              Caminhões-tanque modernos, equipados com telemetria via satélite 24h, sistemas de medição calibrados 
              e conformidade integral com as normas da ANP e ANTT. Veículos pesados para grandes volumes rodoviários 
              e caminhões preparados para o acesso direto às frentes de colheita e lavouras.
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel Showcase */}
        <ScrollReveal direction="up" distance={30} delay={150}>
          <div
            className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Slot -2: Far Left Pill (visible on lg and above) */}
            <button
              type="button"
              onClick={() => goToSlide(farLeft.index)}
              aria-label={`Ver foto ${farLeft.index + 1}`}
              className="hidden lg:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-14 xl:w-20 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-white/80 shrink-0 group focus:outline-none"
            >
              <Image
                src={farLeft.item.src}
                alt={farLeft.item.title}
                fill
                unoptimized
                sizes="100px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/25 group-hover:bg-slate-900/10 transition-colors" />
            </button>

            {/* Slot -1: Near Left Pill (visible on md and above) */}
            <button
              type="button"
              onClick={() => goToSlide(nearLeft.index)}
              aria-label={`Ver foto ${nearLeft.index + 1}`}
              className="hidden md:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-20 sm:w-24 lg:w-32 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-white/90 shrink-0 group focus:outline-none"
            >
              <Image
                src={nearLeft.item.src}
                alt={nearLeft.item.title}
                fill
                unoptimized
                sizes="160px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/15 group-hover:bg-transparent transition-colors" />
            </button>

            {/* Slot 0: Center Hero Card (main large rounded card) */}
            <div className="relative h-[320px] sm:h-[380px] lg:h-[440px] w-full max-w-[660px] lg:max-w-[720px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white bg-slate-950 shrink-0 transition-all duration-500">
              
              {/* Autoplay Timer Indicator Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden pointer-events-none">
                <div
                  key={`timer-${currentIndex}-${isPaused}`}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                  style={{
                    animation: isPaused ? 'none' : 'carousel-timer 5s linear forwards',
                    width: isPaused ? '100%' : undefined,
                  }}
                />
              </div>

              {/* Animated Image with Directional Slide & Zoom */}
              <div
                key={`slide-${currentIndex}`}
                className={`relative w-full h-full ${
                  slideDirection === 'right' ? 'animate-carousel-right' : 'animate-carousel-left'
                }`}
              >
                <Image
                  src={center.item.src}
                  alt={center.item.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>

              {/* Gradient Bottom Overlay with Animated Description */}
              <div
                key={`caption-${currentIndex}`}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent p-5 sm:p-7 text-white flex flex-col justify-end pointer-events-none animate-carousel-caption z-10"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded backdrop-blur-sm border border-amber-400/30">
                    Foto {currentIndex + 1} de {total}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-300 font-medium hidden sm:inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Frota Homologada ANP
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight drop-shadow-sm">
                  {center.item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 max-w-xl opacity-90 drop-shadow-sm">
                  {center.item.subtitle}
                </p>
              </div>

              {/* Navigation Arrows inside center card for easy mobile and desktop access */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-900 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-sm border border-slate-200/50 z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-900 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-sm border border-slate-200/50 z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Slot +1: Near Right Pill (visible on md and above) */}
            <button
              type="button"
              onClick={() => goToSlide(nearRight.index)}
              aria-label={`Ver foto ${nearRight.index + 1}`}
              className="hidden md:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-20 sm:w-24 lg:w-32 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/90 shrink-0 group focus:outline-none"
            >
              <Image
                src={nearRight.item.src}
                alt={nearRight.item.title}
                fill
                unoptimized
                sizes="160px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/15 group-hover:bg-transparent transition-colors" />
            </button>

            {/* Slot +2: Far Right Pill (visible on lg and above) */}
            <button
              type="button"
              onClick={() => goToSlide(farRight.index)}
              aria-label={`Ver foto ${farRight.index + 1}`}
              className="hidden lg:block relative h-[320px] sm:h-[380px] lg:h-[440px] w-14 xl:w-20 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/80 shrink-0 group focus:outline-none"
            >
              <Image
                src={farRight.item.src}
                alt={farRight.item.title}
                fill
                unoptimized
                sizes="100px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/25 group-hover:bg-slate-900/10 transition-colors" />
            </button>

          </div>
        </ScrollReveal>

        {/* Carousel Pagination Indicator & Thumbnails Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto px-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir para foto ${idx + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                    isActive ? 'w-8 bg-amber-500 shadow-xs' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <span>Clique nas laterais ou use as setas para navegar</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-bold font-mono">
              {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
