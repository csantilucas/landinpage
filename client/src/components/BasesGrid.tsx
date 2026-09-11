'use client';

import React from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveBases, fetchSiteContent, OperationalBase } from '@/lib/api';
import CompanyMap from '@/components/CompanyMap';
import ScrollReveal from '@/components/ScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_BASES } from '@/data/fallbackData';

export default function BasesGrid() {
  const { data: basesData, isLoading: isBasesLoading } = useQuery({
    queryKey: ['activeBases'],
    queryFn: fetchActiveBases,
    staleTime: 1000 * 60 * 2,
  });

  const { data: siteContent, isLoading: isContentLoading } = useQuery({
    queryKey: ['siteContent'],
    queryFn: () => fetchSiteContent(),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isBasesLoading && isContentLoading;

  if (isLoading) {
    return (
      <section id="bases" className="py-20 bg-white border-t border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 flex flex-col items-center">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-9 w-72 rounded-xl" />
            <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl p-6 border border-slate-200 space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-7 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Skeleton className="w-full h-96 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  const operationalBases: OperationalBase[] =
    basesData && basesData.length > 0
      ? basesData
      : (siteContent?.company_bases && siteContent.company_bases.length > 0
          ? siteContent.company_bases
          : FALLBACK_BASES);

  return (
    <section id="bases" className="py-20 bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              Onde Estamos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Nossas Bases Operacionais
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Estruturas de distribuição e armazenamento estrategicamente posicionadas para atender com rapidez Rondônia e Mato Grosso.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {operationalBases.map((base, idx) => {
            const isMatriz = base.id === 'vilhena';
            return (
              <ScrollReveal key={base.id} direction="up" delay={idx * 100} distance={30}>
                <div
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all h-full ${
                    isMatriz
                      ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                        {base.city} - {base.state}
                      </span>
                      {isMatriz && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          MATRIZ
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {base.name}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-start gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{base.address}</span>
                    </p>

                    <a
                      href={base.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 mb-3"
                    >
                      <span>Ver no Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Telefones:
                      </span>
                      <div className="flex flex-col gap-1">
                        {base.phones?.map((phone, pIdx) => (
                          <a
                            key={pIdx}
                            href={`tel:${phone.replace(/\D/g, '')}`}
                            className="text-xs font-medium text-slate-700 hover:text-amber-600 flex items-center gap-1.5"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{phone}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                    <a
                      href={`https://wa.me/${base.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de falar com o atendimento da Base ${base.city} - ${base.state} da TRR Krupinski.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Falar no WhatsApp</span>
                    </a>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Embedded Interactive Google Maps Section */}
        <ScrollReveal direction="up" delay={200} distance={35}>
          <CompanyMap />
        </ScrollReveal>

      </div>
    </section>
  );
}
