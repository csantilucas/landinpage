import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MapPin, Award, Truck, Fuel } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutSection() {
  return (
    <section id="empresa" className="py-20 bg-white border-y border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="right" distance={30} duration={800}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
                <div className="relative aspect-[16/11]">
                  <Image
                    src="/images/agro-harvest.jpg"
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
                      <AnimatedCounter end={30} prefix="+" duration={2200} />
                    </div>
                    <div className="text-xs font-bold text-slate-600 leading-tight">
                      Anos de tradição e pontualidade
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <ScrollReveal direction="left" distance={30} duration={800}>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                <Award className="w-3.5 h-3.5" />
                <span>Nossa História</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mt-3">
                Mais de{' '}
                <span className="text-amber-600 font-black inline-flex items-baseline">
                  <AnimatedCounter end={30} suffix=" anos" duration={2200} />
                </span>{' '}
                dedicados ao abastecimento de Rondônia e Mato Grosso
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-4">
                Fundada em <strong>março de 1995</strong>, a <strong>TRR KRUPINSKI</strong> é uma empresa de revenda de combustíveis 
                e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, 
                fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, 
                garantindo que sua safra e sua frota nunca fiquem paradas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Conformidade ANP</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Combustíveis certificados diretamente das melhores distribuidoras.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Bases Próprias</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Estruturas em Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 4-Metric Counter Strip with staggered animation */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <ScrollReveal direction="up" delay={0} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tradição</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={30} prefix="+" suffix=" Anos" duration={2200} />
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
                <AnimatedCounter end={4} suffix=" Bases" duration={1800} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={240} distance={20}>
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-colors h-full">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Fuel className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Volume</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter end={100} prefix="+" suffix="M Litros" duration={2400} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Histórico de confiança em abastecimento agrícola e rodoviário
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
                <AnimatedCounter end={100} suffix="%" duration={2000} />
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
