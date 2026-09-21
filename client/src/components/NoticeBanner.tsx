'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, Bell, CheckCircle2, X, ExternalLink, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Notice, fetchActiveNotices } from '@/lib/api';

const DEFAULT_FALLBACK_NOTICE: Notice = {
  _id: 'default-1',
  title: 'Plantão Safra 2026 Ativo',
  message: 'Atendimento e abastecimento in loco 24 horas para maquinários agrícolas em Rondônia e Mato Grosso.',
  type: 'alert',
  active: true,
  priority: 10,
  linkUrl: 'https://wa.me/556933221100?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20abastecimento%20de%20safra.',
  linkText: 'Solicitar Abastecimento',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function NoticeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('trr_notice_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const { data: notices, isLoading } = useQuery({
    queryKey: ['activeNotices'],
    queryFn: async () => {
      const data = await fetchActiveNotices();
      return data && data.length > 0 ? data : [DEFAULT_FALLBACK_NOTICE];
    },
    staleTime: 1000 * 60 * 2,
  });

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('trr_notice_dismissed', 'true');
  };

  if (dismissed || isLoading || !notices || notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentIndex];

  const getNoticeStyles = (type: Notice['type']) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white',
          badge: 'bg-white/20 text-white border-white/30',
          badgeText: 'Alerta / Plantão',
          icon: <AlertTriangle className="w-5 h-5 text-amber-200 animate-pulse shrink-0" />,
          btn: 'bg-white text-rose-700 hover:bg-rose-50 shadow-sm',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white',
          badge: 'bg-white/20 text-white border-white/30',
          badgeText: 'Comunicado Importante',
          icon: <Bell className="w-5 h-5 text-amber-100 shrink-0" />,
          btn: 'bg-white text-amber-800 hover:bg-amber-50 shadow-sm',
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white',
          badge: 'bg-white/20 text-white border-white/30',
          badgeText: 'Informativo',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />,
          btn: 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-sm',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          badgeText: 'Aviso Oficial',
          icon: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
          btn: 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm',
        };
    }
  };

  const styles = getNoticeStyles(currentNotice.type);

  return (
    <aside
      aria-label="Aviso importante"
      className={`relative z-40 transition-all duration-300 shadow-md ${styles.bg}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Lado Esquerdo: Ícone + Badge + Texto */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="pt-0.5 sm:pt-0">{styles.icon}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border shrink-0 ${styles.badge}`}
              >
                {styles.badgeText}
              </span>
              <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
                <strong className="font-extrabold mr-1.5">{currentNotice.title}:</strong>
                <span className="opacity-95 font-normal">{currentNotice.message}</span>
              </p>
            </div>
          </div>

          {/* Lado Direito: Ação + Navegação (se houver mais de 1) + Fechar */}
          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto shrink-0">
            {currentNotice.linkUrl && (
              <a
                href={currentNotice.linkUrl}
                target={currentNotice.linkUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 ${styles.btn}`}
              >
                <span>{currentNotice.linkText || 'Saiba Mais'}</span>
                {currentNotice.linkUrl.startsWith('http') ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </a>
            )}

            {notices.length > 1 && (
              <div className="flex items-center gap-1 text-[11px] bg-black/20 px-2 py-1 rounded">
                <span>{currentIndex + 1}/{notices.length}</span>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % notices.length)}
                  className="hover:underline ml-1 font-bold"
                  title="Próximo aviso"
                >
                  ›
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Fechar aviso"
              title="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
