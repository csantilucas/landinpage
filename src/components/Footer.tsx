import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import logoImg from '@/app/logo.png';

export default function Footer() {
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
                TRR Krupinski
              </div>
              <div className="text-[11px] text-slate-500">
                Comércio e Transporte de Combustíveis Krupinski Ltda
              </div>
            </div>
          </div>

          {/* Regulatory Badges */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Homologado ANP</span>
            <span>•</span>
            <span>ANTT RNTRC {COMPANY_INFO.anttRegister}</span>
            <span>•</span>
            <span>Desde 1995</span>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} TRR Krupinski. Todos os direitos reservados.
          </div>

        </div>
      </div>
    </footer>
  );
}
