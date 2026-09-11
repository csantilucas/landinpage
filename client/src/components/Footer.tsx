'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, CompanyInfo } from '@/lib/api';
import { FALLBACK_COMPANY_INFO } from '@/data/fallbackData';
import logoImg from '@/app/logo.png';

export default function Footer() {
  const { data: siteContent } = useQuery({
    queryKey: ['siteContent'],
    queryFn: () => fetchSiteContent(),
    staleTime: 1000 * 60 * 5,
  });

  const companyInfo: Partial<CompanyInfo> = siteContent?.company_info || FALLBACK_COMPANY_INFO;

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200 py-10 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-auto flex items-center">
              <Image
                src={logoImg}
                alt="Logo TRR Krupinski"
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {companyInfo.name || 'TRR Krupinski'}
              </div>
              <div className="text-[11px] text-slate-500">
                {companyInfo.fullName || 'Comércio e Transporte de Combustíveis Krupinski Ltda'}
              </div>
            </div>
          </div>

          {/* Regulatory Badges */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Homologado ANP</span>
            <span>•</span>
            <span>ANTT {companyInfo.anttRegister || 'RNTRC 001952720'}</span>
            <span>•</span>
            <span>Desde {companyInfo.foundedYear || 1995}</span>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} {companyInfo.name || 'TRR Krupinski'}. Todos os direitos reservados.
          </div>

        </div>
      </div>
    </footer>
  );
}
