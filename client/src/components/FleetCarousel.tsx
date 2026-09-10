'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchActiveFleet } from '@/lib/api';

export interface FleetItem {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

const DEFAULT_FLEET_ITEMS: FleetItem[] = [
  {
    id: 1,
    src: '/images/frota1.jpeg',
    title: 'Frota Pesada & Unidades Tanque Alinhadas',
    subtitle: 'Caminhões Volvo e Scania com tanques certificados para abastecimento contínuo',
  },
  {
    id: 2,
    src: '/images/frota2.jpeg',
    title: 'Cavalo Mecânico Volvo Globetrotter',
    subtitle: 'Bitrem tanque de grande capacidade para transporte de produtos perigosos rodoviários',
  },
  {
    id: 3,
    src: '/images/frota3.jpeg',
    title: 'Conjunto Randon de Alta Performance',
    subtitle: 'Tanques térmicos e isotérmicos para conservação e controle rigoroso de densidade',
  },
  {
    id: 4,
    src: '/images/frota4.jpeg',
    title: 'Operação Noturna & Plantão na Safra',
    subtitle: 'Prontidão 24 horas para atender colheitadeiras e frotas sem paralisação',
  },
  {
    id: 5,
    src: '/images/frota5.jpeg',
    title: 'Acesso Direto à Lavoura e Terrenos Rurais',
    subtitle: 'Caminhões com tração e suspensão reforçada para estradas vicinais de terra',
  },
  {
    id: 6,
    src: '/images/frota6.jpeg',
    title: 'Pátio Logístico Integrado',
    subtitle: 'Manutenção rigorosa e higienização periódica de tanques para pureza do diesel',
  },
  {
    id: 7,
    src: '/images/frota7.jpeg',
    title: 'Telemetria e Rastreamento Via Satélite',
    subtitle: 'Monitoramento contínuo de rota, velocidade e tempo de deslocamento',
  },
  {
    id: 8,
    src: '/images/frota8.jpeg',
    title: 'Logística Especializada para o Agronegócio',
    subtitle: 'Atendimento pontual aos maiores polos produtores de grãos de RO e MT',
  },
  {
    id: 9,
    src: '/images/frota9.jpeg',
    title: 'Caminhões de Entrega Fracionada',
    subtitle: 'Agilidade para levar combustível diretamente aos tanques aéreos das propriedades',
  },
  {
    id: 10,
    src: '/images/frota10.jpeg',
    title: 'Bombas Medidoras Digitais Calibradas',
    subtitle: 'Medição precisa aferida pelos órgãos reguladores e laudo de entrega',
  },
  {
    id: 11,
    src: '/images/frota11.jpeg',
    title: 'Segurança Operacional e Equipe Treinada',
    subtitle: 'Motoristas capacitados com certificação MOPP e kit de emergência ambiental',
  },
  {
    id: 12,
    src: '/images/frota12.jpeg',
    title: 'Veículos Euro 5 e Euro 6 Modernos',
    subtitle: 'Baixa emissão de poluentes e máxima eficiência energética na rodovia',
  },
  {
    id: 13,
    src: '/images/frota13.jpeg',
    title: 'Estrutura para Grandes Demandas Industriais',
    subtitle: 'Transporte de grandes volumes com pontualidade para usinas, garagens e mineradoras',
  },
  {
    id: 14,
    src: '/images/frota14.jpeg',
    title: 'Infraestrutura de Apoio Rodoviário',
    subtitle: 'Suporte rápido ao longo dos eixos da BR-364 e BR-174',
  },
  {
    id: 15,
    src: '/images/frota15.jpeg',
    title: 'Tradição e Presença em Rondônia e Mato Grosso',
    subtitle: 'Mais de 30 anos cruzando as estradas com segurança e compromisso com o cliente',
  },
];

export default function FleetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // TanStack Query para carregar a frota com cache otimizado
  const { data: fleetData } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 5,
  });

  const items: FleetItem[] = useMemo(() => {
    if (fleetData && fleetData.length > 0) {
      const carouselItems = fleetData.filter(
        (d) => !d.category || d.category === 'carrossel'
      );
      if (carouselItems.length > 0) {
        return carouselItems.map((d, i) => ({
          id: i + 1,
          src: d.imageUrl,
          title: d.title,
          subtitle: d.description || 'Abastecimento com qualidade e segurança TRR Krupinski',
        }));
      }
    }
    return DEFAULT_FLEET_ITEMS;
  }, [fleetData]);

  const total = items.length || 1;

  const nextSlide = useCallback(() => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    const target = (index + total) % total;
    if (target === currentIndex) return;
    setSlideDirection(target > currentIndex ? 'right' : 'left');
    setCurrentIndex(target);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto rotation
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Helper to safely get item by relative offset
  const getItemAtOffset = (offset: number) => {
    const idx = (currentIndex + offset + total) % total;
    return { item: items[idx] || items[0], index: idx };
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

        {/* Carousel Showcase in the exact pill-capsule style of the reference photo */}
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
