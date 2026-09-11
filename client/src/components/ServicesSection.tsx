'use client';

import React from 'react';
import { Fuel, Truck, Droplets, ShieldCheck, Check, Plus, Trash2, Pencil } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchSiteContent } from '@/lib/api';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_SERVICES } from '@/data/fallbackData';

export interface ServiceItem {
  id?: string;
  iconName?: string;
  title: string;
  description: string;
  details: string[];
}

export interface ServicesSectionProps {
  isEditable?: boolean;
  editableData?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      description: string;
      details: string | string[];
      iconName?: string;
    }>;
  };
  onEditChange?: (field: 'badge' | 'title' | 'subtitle', value: string) => void;
  onItemChange?: (index: number, field: string, value: string) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
}

export default function ServicesSection({
  isEditable = false,
  editableData,
  onEditChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: ServicesSectionProps) {
  const { data: servicesContent, isLoading } = useQuery({
    queryKey: ['companyServices'],
    queryFn: async () => {
      const data = await fetchSiteContent('company_services');
      return data;
    },
    staleTime: 1000 * 60 * 2,
    enabled: !isEditable,
  });

  if (isLoading && !isEditable) {
    return (
      <section id="produtos" className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 flex flex-col items-center">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-9 w-3/4 rounded-xl" />
            <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const sectionBadge =
    (isEditable ? editableData?.badge : servicesContent?.badge) ||
    (isEditable ? '' : FALLBACK_SERVICES.badge);
  const sectionTitle =
    (isEditable ? editableData?.title : servicesContent?.title) ||
    (isEditable ? '' : FALLBACK_SERVICES.title);
  const sectionSubtitle =
    (isEditable ? editableData?.subtitle : servicesContent?.subtitle) ||
    (isEditable ? '' : FALLBACK_SERVICES.subtitle);

  const rawItems = isEditable
    ? editableData?.items
    : servicesContent?.items || (Array.isArray(servicesContent) ? servicesContent : null);

  const services = (rawItems && rawItems.length > 0 ? rawItems : (isEditable ? [] : FALLBACK_SERVICES.items)) as any[];

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Fuel':
        return Fuel;
      case 'Droplets':
        return Droplets;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Truck':
      default:
        return Truck;
    }
  };

  return (
    <section id="produtos" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            
            {/* Badge */}
            {isEditable ? (
              <div className="inline-block relative">
                <div className="absolute -top-2.5 -right-2 z-10 bg-amber-500 text-slate-950 p-0.5 rounded shadow-xs">
                  <Pencil className="w-2.5 h-2.5" />
                </div>
                <AutoResizeTextarea
                  rows={1}
                  value={sectionBadge}
                  onChange={(e) => onEditChange?.('badge', e.target.value)}
                  className="text-center px-4 py-1 rounded-full bg-amber-100 border-2 border-dashed border-amber-400 text-amber-900 font-bold text-xs shadow-xs focus:outline-hidden"
                />
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                {sectionBadge}
              </span>
            )}

            {/* Título */}
            {isEditable ? (
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <Pencil className="w-3 h-3 text-amber-400" />
                  <span>Título da Seção</span>
                </div>
                <AutoResizeTextarea
                  rows={1}
                  value={sectionTitle}
                  onChange={(e) => onEditChange?.('title', e.target.value)}
                  className="w-full text-center text-2xl sm:text-3xl font-extrabold text-slate-900 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-amber-500 rounded-xl py-2 px-3 focus:outline-hidden transition-all shadow-xs"
                />
              </div>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
                {sectionTitle}
              </h2>
            )}

            {/* Subtítulo */}
            {isEditable ? (
              <div className="relative">
                <AutoResizeTextarea
                  rows={2}
                  value={sectionSubtitle}
                  onChange={(e) => onEditChange?.('subtitle', e.target.value)}
                  className="w-full text-center text-xs sm:text-sm text-slate-600 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-amber-500 rounded-xl py-1.5 px-3 focus:outline-hidden transition-all shadow-xs"
                />
              </div>
            ) : (
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                {sectionSubtitle}
              </p>
            )}

            {/* Botão de adicionar card no modo de edição */}
            {isEditable && onAddItem && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onAddItem}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Novo Card de Serviço</span>
                </button>
              </div>
            )}

          </div>
        </ScrollReveal>

        {/* Grid de Cards de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((serv: any, index: number) => {
            const Icon = getIcon(serv.iconName);
            const detailsList = Array.isArray(serv.details)
              ? serv.details
              : typeof serv.details === 'string'
              ? (serv.details as string).split('\n').filter(Boolean)
              : [];

            return (
              <ScrollReveal key={index} direction="up" delay={index * 120} distance={30}>
                <div className={`bg-white rounded-2xl p-6 sm:p-8 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full relative ${
                  isEditable ? 'border-2 border-slate-300 hover:border-amber-400' : 'border-slate-200'
                }`}>
                  
                  {/* Botão de excluir no modo editável */}
                  {isEditable && services.length > 1 && onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir este card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div>
                    {/* Ícone */}
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-5">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    {/* Título do Card */}
                    {isEditable ? (
                      <div className="relative mb-3">
                        <div className="absolute -top-2.5 right-2 bg-slate-900 text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                          <Pencil className="w-2.5 h-2.5 text-amber-400" />
                          <span>Título</span>
                        </div>
                        <AutoResizeTextarea
                          rows={1}
                          value={serv.title}
                          onChange={(e) => onItemChange?.(index, 'title', e.target.value)}
                          className="w-full text-lg sm:text-xl font-bold text-slate-900 bg-amber-50/30 border border-slate-200 hover:border-amber-400 focus:border-amber-500 rounded-lg px-3 py-1.5 focus:outline-hidden transition-all shadow-xs"
                        />
                      </div>
                    ) : (
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {serv.title}
                      </h3>
                    )}

                    {/* Descrição */}
                    {isEditable ? (
                      <div className="relative mb-4">
                        <AutoResizeTextarea
                          rows={2}
                          value={serv.description}
                          onChange={(e) => onItemChange?.(index, 'description', e.target.value)}
                          className="w-full text-sm text-slate-600 leading-relaxed bg-amber-50/20 border border-slate-200 hover:border-amber-400 focus:border-amber-500 rounded-lg p-2.5 focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {serv.description}
                      </p>
                    )}

                    {/* Diferenciais / Tópicos */}
                    {isEditable ? (
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Tópicos de diferencial (1 por linha):
                        </label>
                        <AutoResizeTextarea
                          rows={3}
                          value={Array.isArray(serv.details) ? serv.details.join('\n') : (serv.details || '')}
                          onChange={(e) => onItemChange?.(index, 'details', e.target.value)}
                          className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 hover:border-amber-400 focus:border-amber-500 rounded-lg p-2.5 focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {detailsList.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rodapé do Card */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>Cotação Imediata</span>
                      <span>→</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      TRR Krupinski
                    </span>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
