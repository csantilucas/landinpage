'use client';

import React from 'react';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, fetchActiveFleet, formatImageUrl } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_HERO } from '@/data/fallbackData';

export interface HeroSectionProps {
  isEditable?: boolean;
  editableData?: {
    headline?: string;
    subheadline?: string;
    imageUrl?: string;
  };
  onEditChange?: (field: 'headline' | 'subheadline' | 'imageUrl', value: string) => void;
}

export default function HeroSection({
  isEditable = false,
  editableData,
  onEditChange,
}: HeroSectionProps) {
  const { data: siteContent, isLoading: isContentLoading } = useQuery({
    queryKey: ['siteContent'],
    queryFn: () => fetchSiteContent(),
    staleTime: 1000 * 60 * 5,
    enabled: !isEditable,
  });

  const { data: fleetData, isLoading: isFleetLoading } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 2,
    enabled: !isEditable,
  });

  const isLoading = !isEditable && (isContentLoading || isFleetLoading);

  if (isLoading) {
    return (
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
            </div>
            <div className="lg:col-span-5">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const heroData = siteContent?.company_hero;

  const rawImage =
    (isEditable && editableData?.imageUrl) ||
    heroData?.imageUrl ||
    fleetData?.find((f) => f.category === 'hero')?.imageUrl ||
    (isEditable ? '' : FALLBACK_HERO.imageUrl);

  const heroImageSrc = formatImageUrl(rawImage, FALLBACK_HERO.imageUrl);

  const headline =
    (isEditable ? editableData?.headline : heroData?.headline) ||
    (isEditable ? '' : FALLBACK_HERO.headline);

  const subheadline =
    (isEditable ? editableData?.subheadline : heroData?.subheadline) ||
    (isEditable ? '' : FALLBACK_HERO.subheadline);

  return (
    <section className="relative pt-12 pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Coluna de Texto: Título e Descrição */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Título Principal */}
            {isEditable ? (
              <div className="relative group">
                <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                  <Pencil className="w-3 h-3 text-amber-400" />
                  <span>Título Principal (H1)</span>
                </div>
                <AutoResizeTextarea
                  rows={2}
                  value={headline}
                  onChange={(e) => onEditChange?.('headline', e.target.value)}
                  className="w-full text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight bg-amber-50/20 hover:bg-white focus:bg-white border-2 border-slate-400 hover:border-amber-400 focus:border-amber-500 rounded-2xl p-4 pt-5 focus:outline-hidden transition-all shadow-xs"
                />
              </div>
            ) : (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {headline}
              </h1>
            )}

            {/* Descrição */}
            {isEditable ? (
              <div className="relative group">
                <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                  <Pencil className="w-3 h-3 text-amber-400" />
                  <span>Descrição / Subtítulo</span>
                </div>
                <AutoResizeTextarea
                  rows={3}
                  value={subheadline}
                  onChange={(e) => onEditChange?.('subheadline', e.target.value)}
                  className="w-full text-base sm:text-lg text-slate-600 leading-relaxed bg-amber-50/20 hover:bg-white focus:bg-white border-2 border-slate-400 hover:border-amber-400 focus:border-amber-500 rounded-xl p-3.5 pt-4 focus:outline-hidden transition-all shadow-xs"
                />
              </div>
            ) : (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {subheadline}
              </p>
            )}

          </div>

          {/* Coluna da Imagem */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="left" distance={30} delay={150} duration={800}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2 group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={heroImageSrc}
                    alt="Caminhão tanque TRR Krupinski em operação"
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                  
                  {/* Editor da Foto */}
                  {isEditable && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-md p-3 flex flex-col gap-2 z-20 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Foto do Hero</span>
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">Salva no Banco/API</span>
                      </div>
                      <input
                        type="text"
                        value={editableData?.imageUrl || ''}
                        onChange={(e) => onEditChange?.('imageUrl', e.target.value)}
                        placeholder="Cole o link da imagem ou Google Drive"
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-slate-900 text-white border border-slate-700 rounded-lg focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
