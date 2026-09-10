import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MapPin, Award, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { COMPANY_INFO } from '@/data/companyData';
import { fetchSiteContent, fetchActiveFleet } from '@/lib/api';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutSection() {
  const { data: aboutData } = useQuery({
    queryKey: ['companyAbout'],
    queryFn: async () => {
      const data = await fetchSiteContent('company_about');
      return data || {};
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: fleetData } = useQuery({
    queryKey: ['activeFleet'],
    queryFn: fetchActiveFleet,
    staleTime: 1000 * 60 * 2,
  });

  const aboutImageSrc =
    fleetData?.find((f) => f.category === 'sobre')?.imageUrl || '/images/agro-harvest.jpg';

  const headline =
    aboutData?.headline ||
    'Mais de 30 anos dedicados ao abastecimento de Rondônia e Mato Grosso';
  const text1 =
    aboutData?.text1 ||
    'Fundada em março de 1995, a TRR KRUPINSKI é uma empresa de revenda de combustíveis e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.';
  const text2 =
    aboutData?.text2 ||
    'Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, garantindo que sua safra e sua frota nunca fiquem paradas.';

  const statYears = Number(aboutData?.years) || 30;
  const statBases = Number(aboutData?.bases) || 4;
  const statPunctuality = Number(aboutData?.punctuality) || 100;
  const statCompliance = Number(aboutData?.compliance) || 100;

  return (
    <section id="empresa" className="py-20 bg-white border-y border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="right" distance={30} duration={800}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
                <div className="relative aspect-[16/11]">
                  <Image
                    src={aboutImageSrc}
                    alt="Abastecimento no campo TRR Krupinski"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Counter Badge */}
              <div className="absolute -bottom-6 -right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-amber-200/90 max-w-[210px] sm:max-w-[250px] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline">
                      <AnimatedCounter end={statYears} prefix="+" duration={2200} />
                    </div>
                    <div className="text-xs font-bold text-slate-600 leading-tight">
                      Anos de tradição e pontualidade
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="left" distance={30} duration={800}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Sobre a TRR Krupinski</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-3">
                {headline}
              </h2>

              <p className="text-slate-600 text-base leading-relaxed mt-4">
                {text1}
              </p>

              <p className="text-slate-600 text-base leading-relaxed mt-3">
                {text2}
              </p>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Distribuidor Autorizado ANP</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Transportador Certificado ANTT</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 4-Metric Counter Strip with staggered animation (sem litros) */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <ScrollReveal direction="up" delay={0} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tradição</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={statYears} prefix="+" suffix=" Anos" duration={2200} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Fundada em 1995 com sede própria em Vilhena - RO
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={120} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estrutura</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={statBases} suffix=" Bases" duration={1800} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={240} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Truck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pontualidade</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={statPunctuality} suffix="%" duration={2000} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Compromisso com abastecimento sem paralisações na safra
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={360} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Conformidade</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={statCompliance} suffix="%" duration={2000} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Normas ANP, ANTT e laudos de pureza a cada entrega
              </p>
            </div>
          </ScrollReveal>

      </div>
      </div>
    </section>
  );
}
