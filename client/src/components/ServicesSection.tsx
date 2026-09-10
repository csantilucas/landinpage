'use client';

import React from 'react';
import Image from 'next/image';
import { Fuel, Truck, Droplets, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchSiteContent } from '@/lib/api';

export interface ServiceItem {
  id?: string;
  iconName?: string;
  title: string;
  description: string;
  details: string[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    iconName: 'Fuel',
    title: 'Óleo Diesel S-10 e S-500',
    description:
      'Fornecimento a granel com laudo de pureza e densidade. Combustível filtrado para máxima performance e proteção de motores agrícolas e rodoviários.',
    details: [
      'Óleo Diesel S-10 (Ultrabaixo teor de enxofre)',
      'Óleo Diesel S-500 para frotas pesadas',
      'Entrega direta no seu ponto de consumo',
    ],
  },
  {
    iconName: 'Truck',
    title: 'Abastecimento Direto na Lavoura',
    description:
      'Caminhões equipados com bombas abastecedoras digitais calibradas para abastecer tratores, colheitadeiras e frotas direto na frente de colheita.',
    details: [
      'Descarga rápida com medição certificada',
      'Atendimento no campo sem paralisar a safra',
      'Flexibilidade de horários e plantão contínuo',
    ],
  },
  {
    iconName: 'Droplets',
    title: 'Lubrificantes & Arla 32',
    description:
      'Linha completa de óleos lubrificantes minerais e sintéticos para transmissões, motores pesados, sistemas hidráulicos e graxas para rolamentos.',
    details: [
      'Óleos de alta performance multiviscosos',
      'Fluidos hidráulicos e graxas especiais',
      'Arla 32 certificado pelo Inmetro',
    ],
  },
  {
    iconName: 'ShieldCheck',
    title: 'Transporte Rodoviário Perigoso',
    description:
      'Logística especializada no transporte rodoviário de cargas perigosas com registro ativo na ANTT (RNTRC 001952720) e motoristas capacitados (MOPP).',
    details: [
      'Frota própria com rastreamento 24h via satélite',
      'Caminhões adequados para acessos rurais e vicinais',
      'Atendimento em todo Rondônia e Mato Grosso',
    ],
  },
];

export default function ServicesSection() {
  const { data: servicesContent } = useQuery({
    queryKey: ['companyServices'],
    queryFn: async () => {
      const data = await fetchSiteContent('company_services');
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const sectionBadge = servicesContent?.badge || 'O Que Oferecemos';
  const sectionTitle = servicesContent?.title || 'Produtos e Soluções para Sua Operação';
  const sectionSubtitle =
    servicesContent?.subtitle ||
    'Do fornecimento diário de diesel ao abastecimento direto em maquinários na lavoura.';

  const rawItems = servicesContent?.items || (Array.isArray(servicesContent) ? servicesContent : null);
  const services: ServiceItem[] = rawItems && rawItems.length > 0 ? rawItems : DEFAULT_SERVICES;

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Fuel':
        return Fuel;
      case 'Droplets':
        return Droplets;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Truck':
      default:
        return Truck;
    }
  };

  return (
    <section id="produtos" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              {sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              {sectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {sectionSubtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((serv, index) => {
            const Icon = getIcon(serv.iconName);
            return (
              <ScrollReveal key={index} direction="up" delay={index * 120} distance={30}>
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-5">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {serv.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {serv.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {serv.details &&
                        serv.details.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Banner de Entrega Programada na Safra (Sem menção a tanques) */}
        <ScrollReveal direction="up" delay={200} distance={30}>
          <div className="mt-10 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[220px]">
              <Image
                src="/images/agro-harvest.jpg"
                alt="Abastecimento programado na safra"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Pontualidade na Safra
              </span>
              <h4 className="text-xl font-bold text-slate-900">
                Abastecimento Programado para sua Propriedade ou Pátio
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Planeje o abastecimento da sua frota e maquinários agrícolas conosco. 
                Garantimos pontualidade na entrega, medição eletrônica precisa e diesel 100% certificado 
                para que sua produção nunca sofra interrupções.
              </p>
              <div className="pt-2">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  <span>Falar com nossa equipe comercial</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
