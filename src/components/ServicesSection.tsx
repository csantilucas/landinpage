import React from 'react';
import Image from 'next/image';
import { Fuel, Wrench, Droplets, Truck, Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function ServicesSection() {
  const services = [
    {
      icon: Fuel,
      title: "Óleo Diesel S-10 e S-500",
      description: "Fornecimento a granel com laudo de pureza e densidade. Combustível filtrado para máxima performance e proteção de motores agrícolas e rodoviários.",
      details: ["Óleo Diesel S-10 (Ultrabaixo enxofre)", "Óleo Diesel S-500 para frotas pesadas", "Entrega direta no seu ponto de consumo"]
    },
    {
      icon: Wrench,
      title: "Tanques e Bombas em Comodato",
      description: "Disponibilizamos tanques aéreos metálicos e bombas abastecedoras digitais para você ter seu próprio ponto de abastecimento na fazenda ou pátio.",
      details: ["Tanques certificados com bacia de contenção", "Bomba medidora de alta vazão", "Mais comodidade e controle do consumo"]
    },
    {
      icon: Droplets,
      title: "Lubrificantes & Arla 32",
      description: "Linha completa de óleos lubrificantes minerais e sintéticos para transmissões, motores pesados, sistemas hidráulicos e graxas para rolamentos.",
      details: ["Óleos de alta performance multiviscosos", "Fluidos hidráulicos e graxas especiais", "Arla 32 certificado pelo Inmetro"]
    },
    {
      icon: Truck,
      title: "Transporte Rodoviário Perigoso",
      description: "Logística especializada no transporte rodoviário de cargas perigosas com registro ativo na ANTT (RNTRC 001952720) e motoristas capacitados (MOPP).",
      details: ["Frota própria com rastreamento 24h", "Caminhões adequados para acessos rurais", "Atendimento em todo RO e MT"]
    }
  ];

  return (
    <section id="produtos" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              O Que Oferecemos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Produtos e Soluções para Sua Operação
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Do fornecimento diário de diesel à estrutura completa de abastecimento na sua propriedade.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((serv, index) => {
            const Icon = serv.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 120} distance={30}>
                <div
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full"
                >
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
                      {serv.details.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
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

        {/* Tank Image Banner */}
        <ScrollReveal direction="up" delay={200} distance={30}>
          <div className="mt-10 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[220px]">
              <Image
                src="/images/comodato-tank.jpg"
                alt="Instalação de tanque em comodato no campo"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Infraestrutura no Campo
              </span>
              <h4 className="text-xl font-bold text-slate-900">
                Precisa de um tanque próprio na sua fazenda ou pátio?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Consulte nossa equipe sobre a instalação de módulos aéreos de abastecimento em comodato. 
                Você economiza tempo, evita deslocamento de maquinários e controla cada litro abastecido.
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
