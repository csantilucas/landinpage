'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, MessageSquare, ShieldCheck, MapPin, Pencil } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, fetchActiveFleet, formatImageUrl, CompanyInfo } from '@/lib/api';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_HERO, FALLBACK_COMPANY_INFO, FALLBACK_BASES } from '@/data/fallbackData';

export interface HeroSectionProps {
  isEditable?: boolean;
  editableData?: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    imageUrl?: string;
  };
  onEditChange?: (field: 'badge' | 'headline' | 'subheadline' | 'imageUrl', value: string) => void;
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
      <section className="relative pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-7 w-48 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-12 w-48 rounded-xl" />
                <Skeleton className="h-12 w-44 rounded-xl" />
              </div>
              <div className="pt-4 flex gap-6 border-t border-slate-200">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-36" />
              </div>
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
  const companyInfo: Partial<CompanyInfo> = siteContent?.company_info || (isEditable ? {} : FALLBACK_COMPANY_INFO);
  const basesCount = siteContent?.company_bases?.length || FALLBACK_BASES.length;

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

  const badgeText =
    (isEditable ? editableData?.badge : heroData?.badge) ||
    (isEditable ? '' : FALLBACK_HERO.badge);

  const mainWhatsApp = companyInfo.mainWhatsApp || FALLBACK_COMPANY_INFO.mainWhatsApp;
  const anttRegister = companyInfo.anttRegister || FALLBACK_COMPANY_INFO.anttRegister;

  return (
    <section className="relative pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal direction="up" distance={20} duration={600}>
              <div className="flex flex-wrap items-center gap-3">
                {/* Brand Logo */}
                
                {/* Badge de Tradição */}
                {isEditable ? (
                  <div className="relative group max-w-md flex-1">
                    <div className="absolute -top-2.5 -right-2 z-10 bg-amber-500 text-slate-950 p-1 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                      <Pencil className="w-3 h-3" />
                      <span>Selo</span>
                    </div>
                    <AutoResizeTextarea
                      rows={1}
                      value={badgeText}
                      onChange={(e) => onEditChange?.('badge', e.target.value)}
                      placeholder="Texto do selo de destaque..."
                      className="w-full px-3 py-1.5 rounded-2xl bg-amber-50/80 border-2 border-dashed border-amber-400 hover:border-amber-500 focus:border-amber-500 focus:bg-white text-amber-900 text-xs font-semibold shadow-xs focus:outline-hidden transition-all"
                    />
                  </div>
                ) : badgeText ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>{badgeText}</span>
                  </div>
                ) : null}
              </div>
            </ScrollReveal>

            {/* Headline com modo de edição auto-expansível */}
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

            {/* Subheadline com modo de edição auto-expansível */}
            {isEditable ? (
              <div className="relative group">
                <div className="absolute -top-3.5 left-3 z-10 bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[10px] font-bold pointer-events-none">
                  <Pencil className="w-3 h-3 text-amber-400" />
                  <span>Subtítulo / Descrição</span>
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

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={isEditable ? '#' : `https://wa.me/${mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
                target={isEditable ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors ${
                  isEditable ? 'cursor-default opacity-90' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Atendimento WhatsApp</span>
              </a>

              <a
                href={isEditable ? '#' : '#bases'}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 transition-colors ${
                  isEditable ? 'cursor-default opacity-90' : ''
                }`}
              >
                <span>Conhecer Nossas Bases</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Credenciais Institucionais */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Homologado ANP</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ANTT {anttRegister}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{basesCount} BASES PARA ATENDIMENTO</span>
              </div>
            </div>

          </div>

          {/* Card de Foto do Caminhão com Edição da Imagem */}
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
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 z-10">
                    <Image
                      src="/logo.png"
                      alt="TRR Krupinski"
                      width={60}
                      height={20}
                      className="h-4 w-auto object-contain"
                    />
                    <span className="text-[10px] font-bold text-slate-800 tracking-wider">
                      TRR KRUPINSKI
                    </span>
                  </div>

                  {/* Editor da Foto Hero */}
                  {isEditable && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-md p-3 flex flex-col gap-2 z-20 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Foto do Banner (Hero)</span>
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
                <div className="p-3 text-center">
                  <p className="text-xs font-medium text-slate-600">
                    Frota própria preparada para entregas rodoviárias e em lavouras
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
