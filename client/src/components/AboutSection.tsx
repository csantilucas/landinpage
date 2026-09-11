'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MapPin, Award, Truck, Pencil } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, fetchActiveFleet, formatImageUrl } from '@/lib/api';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_ABOUT } from '@/data/fallbackData';

export interface AboutSectionProps {
  isEditable?: boolean;
  editableData?: {
    headline?: string;
    text1?: string;
    text2?: string;
    years?: number;
    bases?: number;
    punctuality?: number;
    compliance?: number;
    imageUrl?: string;
  };
  onEditChange?: (field: string, value: any) => void;
}

export default function AboutSection({
  isEditable = false,
  editableData,
  onEditChange,
}: AboutSectionProps) {
  const { data: aboutData, isLoading: isAboutLoading } = useQuery({
    queryKey: ['companyAbout'],
    queryFn: async () => {
      const data = await fetchSiteContent('company_about');
      return data || {};
    },
    staleTime: 1000 * 60 * 2,
    enabled: !isEditable,
  });

  const { data: fleetData, isLoading: isFleetLoading } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 2,
    enabled: !isEditable,
  });

  const isLoading = !isEditable && (isAboutLoading || isFleetLoading);

  if (isLoading) {
    return (
      <section id="empresa" className="py-20 bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <Skeleton className="w-full aspect-[16/11] rounded-2xl" />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <Skeleton className="h-5 w-36 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-4/5" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const rawImage =
    (isEditable && editableData?.imageUrl) ||
    aboutData?.imageUrl ||
    fleetData?.find((f) => f.category === 'sobre')?.imageUrl ||
    (isEditable ? '' : FALLBACK_ABOUT.imageUrl);

  const aboutImageSrc = formatImageUrl(rawImage, FALLBACK_ABOUT.imageUrl);

  const headline =
    (isEditable ? editableData?.headline : aboutData?.headline) ||
    (isEditable ? '' : FALLBACK_ABOUT.headline);

  const text1 =
    (isEditable ? editableData?.text1 : aboutData?.text1) ||
    (isEditable ? '' : FALLBACK_ABOUT.text1);

  const text2 =
    (isEditable ? editableData?.text2 : aboutData?.text2) ||
    (isEditable ? '' : FALLBACK_ABOUT.text2);

  const statYears = Number(isEditable ? editableData?.years : (aboutData?.years ?? FALLBACK_ABOUT.years));
  const statBases = Number(isEditable ? editableData?.bases : (aboutData?.bases ?? FALLBACK_ABOUT.bases));
  const statPunctuality = Number(isEditable ? editableData?.punctuality : (aboutData?.punctuality ?? FALLBACK_ABOUT.punctuality));
  const statCompliance = Number(isEditable ? editableData?.compliance : (aboutData?.compliance ?? FALLBACK_ABOUT.compliance));

  return (
    <section id="empresa" className="py-20 bg-white border-y border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado da Imagem com Edição */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="right" distance={30} duration={800}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative group">
                <div className="relative aspect-[16/11] bg-slate-100">
                  <Image
                    src={aboutImageSrc}
                    alt="Abastecimento no campo TRR Krupinski"
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {/* Editor da Foto Sobre */}
                  {isEditable && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-md p-3 flex flex-col gap-2 z-20 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Foto da Seção Sobre (Colheita / Safra)</span>
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">Salva no Banco/API</span>
                      </div>
                      <input
                        type="text"
                        value={editableData?.imageUrl || ''}
                        onChange={(e) => onEditChange?.('imageUrl', e.target.value)}
                        placeholder="Cole o link do Google Drive ou URL direta"
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-slate-900 text-white border border-slate-700 rounded-lg focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Counter Badge */}
              <div className="absolute -bottom-6 -right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-amber-200/90 max-w-[220px] sm:max-w-[260px] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    {isEditable ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">+</span>
                        <input
                          type="number"
                          value={statYears}
                          onChange={(e) => onEditChange?.('years', Number(e.target.value))}
                          className="w-14 px-1 py-0.5 rounded border-2 border-dashed border-amber-400 font-black text-xl text-slate-900 text-center"
                          title="Editar anos de tradição"
                        />
                        <span className="text-xs font-bold text-slate-600">Anos</span>
                      </div>
                    ) : (
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline">
                        <AnimatedCounter end={statYears} prefix="+" duration={2200} />
                        <span className="text-sm ml-1 font-bold text-slate-500">Anos</span>
                      </div>
                    )}
                    <div className="text-xs font-bold text-slate-600 leading-tight mt-0.5">
                      Tradição e pontualidade
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Lado dos Textos Auto-Expansíveis */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="left" distance={30} duration={800}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Sobre a TRR Krupinski</span>
              </div>

              {/* Título da Seção Sobre */}
              {isEditable ? (
                <div className="relative group mt-3">
                  <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                    <Pencil className="w-3 h-3 text-amber-400" />
                    <span>Título da Seção Sobre</span>
                  </div>
                  <AutoResizeTextarea
                    rows={2}
                    value={headline}
                    onChange={(e) => onEditChange?.('headline', e.target.value)}
                    className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug bg-amber-50/20 hover:bg-white focus:bg-white border-2 border-slate-400 hover:border-amber-400 focus:border-amber-500 rounded-2xl p-4 pt-5 focus:outline-hidden transition-all shadow-xs"
                  />
                </div>
              ) : headline ? (
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-3">
                  {headline}
                </h2>
              ) : null}

              {/* Parágrafo 1 Auto-Expansível */}
              {isEditable ? (
                <div className="relative group mt-4">
                  <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                    <Pencil className="w-3 h-3 text-amber-400" />
                    <span>Primeiro Parágrafo (História)</span>
                  </div>
                  <AutoResizeTextarea
                    rows={3}
                    value={text1}
                    onChange={(e) => onEditChange?.('text1', e.target.value)}
                    className="w-full text-sm sm:text-base text-slate-600 leading-relaxed bg-amber-50/20 hover:bg-white focus:bg-white border-2 border-slate-400 hover:border-amber-400 focus:border-amber-500 rounded-xl p-3.5 pt-4 focus:outline-hidden transition-all shadow-xs"
                  />
                </div>
              ) : text1 ? (
                <p className="text-slate-600 text-base leading-relaxed mt-4">
                  {text1}
                </p>
              ) : null}

              {/* Parágrafo 2 Auto-Expansível */}
              {isEditable ? (
                <div className="relative group mt-3">
                  <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                    <Pencil className="w-3 h-3 text-amber-400" />
                    <span>Segundo Parágrafo (Atuação Regional)</span>
                  </div>
                  <AutoResizeTextarea
                    rows={3}
                    value={text2}
                    onChange={(e) => onEditChange?.('text2', e.target.value)}
                    className="w-full text-sm sm:text-base text-slate-600 leading-relaxed bg-amber-50/20 hover:bg-white focus:bg-white border-2 border-slate-400 hover:border-amber-400 focus:border-amber-500 rounded-xl p-3.5 pt-4 focus:outline-hidden transition-all shadow-xs"
                  />
                </div>
              ) : text2 ? (
                <p className="text-slate-600 text-base leading-relaxed mt-3">
                  {text2}
                </p>
              ) : null}

              {/* Badges de Confiança */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Distribuidor Autorizado ANP</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Certificação de Pureza Digital</span>
                </div>
              </div>

              {/* Seção de Métricas / Contadores In-Place */}
              {isEditable && (
                <div className="pt-2">
                  <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Contadores Numéricos em Destaque:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Anos</label>
                      <input
                        type="number"
                        value={statYears}
                        onChange={(e) => onEditChange?.('years', Number(e.target.value))}
                        className="w-full text-center font-black text-lg text-slate-900 bg-white rounded border border-slate-300 py-1"
                      />
                      <span className="text-[10px] font-bold text-amber-800 mt-1 block">Tradição</span>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Bases</label>
                      <input
                        type="number"
                        value={statBases}
                        onChange={(e) => onEditChange?.('bases', Number(e.target.value))}
                        className="w-full text-center font-black text-lg text-slate-900 bg-white rounded border border-slate-300 py-1"
                      />
                      <span className="text-[10px] font-bold text-amber-800 mt-1 block">RO & MT</span>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">% Pontual</label>
                      <input
                        type="number"
                        value={statPunctuality}
                        onChange={(e) => onEditChange?.('punctuality', Number(e.target.value))}
                        className="w-full text-center font-black text-lg text-slate-900 bg-white rounded border border-slate-300 py-1"
                      />
                      <span className="text-[10px] font-bold text-amber-800 mt-1 block">Compromisso</span>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">% Normas</label>
                      <input
                        type="number"
                        value={statCompliance}
                        onChange={(e) => onEditChange?.('compliance', Number(e.target.value))}
                        className="w-full text-center font-black text-lg text-slate-900 bg-white rounded border border-slate-300 py-1"
                      />
                      <span className="text-[10px] font-bold text-amber-800 mt-1 block">ANP / ANTT</span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
