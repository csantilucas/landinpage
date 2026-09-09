'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Menu, X, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import logoImg from '@/app/logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative h-11 w-auto flex items-center">
              <Image
                src={logoImg}
                alt="Logo TRR Krupinski"
                height={42}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                TRR <span className="text-amber-600">KRUPINSKI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Combustíveis & Lubrificantes
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-amber-600 transition-colors">Início</a>
            <a href="#empresa" className="hover:text-amber-600 transition-colors">A Empresa</a>
            <a href="#produtos" className="hover:text-amber-600 transition-colors">Combustíveis</a>
            <a href="#bases" className="hover:text-amber-600 transition-colors">Bases</a>
            <a href="#contato" className="hover:text-amber-600 transition-colors">Contato</a>
          </nav>

          {/* Quick Contact Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.mainPhone.replace(/\D/g, '')}`}
              className="text-xs font-semibold text-slate-700 hover:text-amber-600 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{COMPANY_INFO.mainPhone}</span>
            </a>

            <a
              href={`https://wa.me/${COMPANY_INFO.mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de informações sobre a TRR Krupinski.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-600">Início</a>
            <a href="#empresa" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-600">A Empresa</a>
            <a href="#produtos" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-600">Combustíveis & Serviços</a>
            <a href="#bases" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-600">Bases Operacionais</a>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-600">Contato</a>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${COMPANY_INFO.mainPhone.replace(/\D/g, '')}`}
              className="py-2.5 text-center text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg"
            >
              Ligar: {COMPANY_INFO.mainPhone}
            </a>
            <a
              href={`https://wa.me/${COMPANY_INFO.mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com a TRR Krupinski.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 text-center text-xs font-bold text-white bg-emerald-600 rounded-lg flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
