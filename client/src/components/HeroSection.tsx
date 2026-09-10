import React from 'react';
import Image from 'next/image';
import { ArrowRight, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { COMPANY_INFO } from '@/data/companyData';
import { fetchSiteContent, fetchActiveFleet } from '@/lib/api';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';

export default function HeroSection() {
  const { data: heroData } = useQuery({
    queryKey: ['companyHero'],
    queryFn: async () => {
      const content = await fetchSiteContent();
      return content.company_hero;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: fleetData } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 2,
  });

  const heroImageSrc =
    fleetData?.find((f) => f.category === 'hero')?.imageUrl || '/images/hero-truck.jpg';

  const headline =
    heroData?.headline ||
    'Revenda e transporte de combustíveis com pontualidade e confiança.';
  const subheadline =
    heroData?.subheadline ||
    'Atendemos o agronegócio, transportadoras e empresas em Rondônia e Mato Grosso com óleo diesel de alta qualidade, abastecimento direto na lavoura e transporte rodoviário seguro.';

  return (
    <section className="relative pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal direction="up" distance={20} duration={600}>
              <div className="flex flex-wrap items-center gap-3">
                {/* Brand Logo */}
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Logo TRR Krupinski"
                    width={90}
                    height={32}
                    className="h-7 w-auto object-contain"
                    priority
                  />
                  <div className="h-4 w-px bg-slate-200" />
                  <span className="text-[11px] font-black text-slate-800 tracking-wider">
                    TRR KRUPINSKI
                  </span>
                </div>

                {/* Badge de Tradição */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>
                    Fundada em 1995 • Mais de <span className="font-bold text-amber-900"><AnimatedCounter end={30} duration={2000} /> anos</span> de tradição
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={25} delay={100} duration={700}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {headline}
              </h1>
            </ScrollReveal>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${COMPANY_INFO.mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Atendimento WhatsApp</span>
              </a>

              <a
                href="#bases"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
              >
                <span>Conhecer Nossas Bases</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Quick credentials */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Homologado ANP</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ANTT {COMPANY_INFO.anttRegister}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>4 BASES PARA ATENDIMENTO</span>
              </div>
            </div>

          </div>

          {/* Clean Image Card */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="left" distance={30} delay={150} duration={800}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={heroImageSrc}
                    alt="Caminhão tanque TRR Krupinski em operação"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5">
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
