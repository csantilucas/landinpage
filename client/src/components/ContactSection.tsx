'use client';

import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, ShieldCheck, ExternalLink, Navigation, Pencil, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, CompanyInfo } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_CONTACT, FALLBACK_COMPANY_INFO } from '@/data/fallbackData';

export interface ContactSectionProps {
  isEditable?: boolean;
  editableData?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    hours?: string;
  };
  onEditChange?: (field: 'badge' | 'title' | 'subtitle' | 'phone' | 'whatsapp' | 'email' | 'hours', value: string) => void;
}

export default function ContactSection({
  isEditable = false,
  editableData,
  onEditChange,
}: ContactSectionProps) {
  const { data: siteContent, isLoading } = useQuery({
    queryKey: ['siteContent'],
    queryFn: () => fetchSiteContent(),
    staleTime: 1000 * 60 * 5,
    enabled: !isEditable,
  });

  if (isLoading && !isEditable) {
    return (
      <section id="contato" className="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3 flex flex-col items-center">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-9 w-80 rounded-xl" />
            <Skeleton className="h-5 w-full max-w-md rounded-lg" />
          </div>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const companyInfo: Partial<CompanyInfo> =
    siteContent?.company_info || (isEditable ? {} : FALLBACK_COMPANY_INFO);
  const contactData =
    siteContent?.company_contact || (isEditable ? {} : FALLBACK_CONTACT);

  const currentBadge =
    editableData?.badge || contactData.badge || FALLBACK_CONTACT.badge;
  const currentTitle =
    editableData?.title || contactData.title || (companyInfo.name ? `Entre em Contato com a ${companyInfo.name}` : FALLBACK_CONTACT.title);
  const currentSubtitle =
    editableData?.subtitle || contactData.subtitle || FALLBACK_CONTACT.subtitle;

  const currentPhone =
    editableData?.phone || contactData.phone || companyInfo.mainPhone || FALLBACK_CONTACT.phone;
  const currentWhatsApp =
    editableData?.whatsapp || contactData.whatsapp || companyInfo.mainWhatsApp || FALLBACK_CONTACT.whatsapp;
  const currentEmail =
    editableData?.email || contactData.email || companyInfo.email || FALLBACK_CONTACT.email;
  const currentHours =
    editableData?.hours || contactData.hours || companyInfo.hours || FALLBACK_CONTACT.hours;

  const matrizAddress =
    companyInfo.matrizAddress || FALLBACK_COMPANY_INFO.matrizAddress;
  const googleMapsUrl =
    companyInfo.googleMapsUrl || FALLBACK_COMPANY_INFO.googleMapsUrl;
  const anttRegister =
    companyInfo.anttRegister || FALLBACK_COMPANY_INFO.anttRegister;

  return (
    <section id="contato" className="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-xl mx-auto mb-12">
            {isEditable ? (
              <div className="inline-block relative mb-2">
                <AutoResizeTextarea
                  rows={1}
                  value={currentBadge}
                  onChange={(e) => onEditChange?.('badge', e.target.value)}
                  className="text-center text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-md border border-dashed border-amber-400 focus:outline-hidden"
                />
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-md">
                {currentBadge}
              </span>
            )}

            {isEditable ? (
              <div className="mt-2">
                <AutoResizeTextarea
                  rows={1}
                  value={currentTitle}
                  onChange={(e) => onEditChange?.('title', e.target.value)}
                  className="w-full text-center text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight bg-white border border-slate-300 rounded-xl p-2 focus:outline-hidden"
                />
              </div>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
                {currentTitle}
              </h2>
            )}

            {isEditable ? (
              <div className="mt-2">
                <AutoResizeTextarea
                  rows={2}
                  value={currentSubtitle}
                  onChange={(e) => onEditChange?.('subtitle', e.target.value)}
                  className="w-full text-center text-slate-600 text-sm sm:text-base bg-white border border-slate-300 rounded-xl p-2 focus:outline-hidden"
                />
              </div>
            ) : (
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                {currentSubtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={150}>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Matriz em Vilhena - Rondônia
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{matrizAddress}</span>
                  </p>
                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Abrir no Google Maps (Setor Industrial)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Telefone Fixo */}
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-xs text-slate-500">Telefone:</span>
                    {isEditable ? (
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentPhone}
                          onChange={(e) => onEditChange?.('phone', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs font-bold text-slate-900 bg-amber-50/40 border border-amber-300 rounded focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <a href={`tel:${currentPhone.replace(/\D/g, '')}`} className="hover:text-amber-600 font-bold">
                        {currentPhone}
                      </a>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-xs text-slate-500">WhatsApp:</span>
                    {isEditable ? (
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentWhatsApp}
                          onChange={(e) => onEditChange?.('whatsapp', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs font-bold text-slate-900 bg-amber-50/40 border border-amber-300 rounded focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-slate-800">{currentWhatsApp}</span>
                    )}
                  </div>

                  {/* E-mail */}
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-xs text-slate-500">E-mail:</span>
                    {isEditable ? (
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={currentEmail}
                          onChange={(e) => onEditChange?.('email', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs font-bold text-slate-900 bg-amber-50/40 border border-amber-300 rounded focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <span>{currentEmail}</span>
                    )}
                  </div>

                  {/* Horários */}
                  {isEditable ? (
                    <div className="flex items-start gap-2 text-sm text-slate-700">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                      <span className="font-semibold text-xs text-slate-500 mt-1">Horário:</span>
                      <div className="relative flex-1">
                        <AutoResizeTextarea
                          rows={1}
                          value={currentHours}
                          onChange={(e) => onEditChange?.('hours', e.target.value)}
                          className="w-full px-2 py-1 text-xs font-medium text-slate-800 bg-amber-50/40 border border-amber-300 rounded focus:outline-hidden transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  ) : currentHours ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{currentHours}</span>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Empresa autorizada pela ANP • Registro ANTT {anttRegister}</span>
                </div>
              </div>

              {/* Lado Direito: Atendimento WhatsApp */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Atendimento Rápido via WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Tire dúvidas sobre entregas, rotas e produtos com nossos consultores.
                  </p>
                </div>

                <a
                  href={isEditable ? '#' : `https://wa.me/${currentWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
                  target={isEditable ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-sm transition-colors ${
                    isEditable ? 'cursor-default opacity-90' : ''
                  }`}
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Iniciar Conversa no WhatsApp</span>
                </a>

                <a
                  href={isEditable ? '#' : `tel:${currentPhone.replace(/\D/g, '')}`}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors ${
                    isEditable ? 'cursor-default' : ''
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ligar Agora ({currentPhone})</span>
                </a>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
