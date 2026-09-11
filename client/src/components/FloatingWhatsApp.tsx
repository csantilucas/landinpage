'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent } from '@/lib/api';
import { FALLBACK_COMPANY_INFO } from '@/data/fallbackData';

export default function FloatingWhatsApp() {
  const { data: siteContent } = useQuery({
    queryKey: ['siteContent'],
    queryFn: () => fetchSiteContent(),
    staleTime: 1000 * 60 * 5,
  });

  const whatsappNumber = siteContent?.company_info?.mainWhatsApp || FALLBACK_COMPANY_INFO.mainWhatsApp;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp com TRR Krupinski"
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-pulse-subtle hover:scale-105 active:scale-95 transition-all"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </a>
    </div>
  );
}
