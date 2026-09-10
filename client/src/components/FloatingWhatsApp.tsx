'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${COMPANY_INFO.mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
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
