import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, ShieldCheck, ExternalLink, Navigation } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactSection() {
  return (
    <section id="contato" className="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={25}>
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-md">
              Atendimento
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Entre em Contato com a TRR Krupinski
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Nossa equipe está pronta para atender seu pedido com rapidez e eficiência.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={150}>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Matriz em Vilhena - Rondônia
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{COMPANY_INFO.matrizAddress}</span>
                  </p>
                  <div className="pt-2">
                    <a
                      href={COMPANY_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Abrir no Google Maps (Setor Industrial)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">Telefone Central:</span>
                    <a href={`tel:${COMPANY_INFO.mainPhone.replace(/\D/g, '')}`} className="hover:text-amber-600 font-bold">
                      {COMPANY_INFO.mainPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">Plantão:</span>
                    <a href={`tel:${COMPANY_INFO.mainEmergencyPhone.replace(/\D/g, '')}`} className="hover:text-amber-600 font-bold">
                      {COMPANY_INFO.mainEmergencyPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">E-mail:</span>
                    <span>{COMPANY_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Empresa autorizada pela ANP • Registro ANTT RNTRC {COMPANY_INFO.anttRegister}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Atendimento Rápido via WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Tire dúvidas sobre entregas, rotas e produtos com nossos consultores.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${COMPANY_INFO.mainWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da TRR Krupinski.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Iniciar Conversa no WhatsApp</span>
                </a>

                <a
                  href={`tel:${COMPANY_INFO.mainPhone.replace(/\D/g, '')}`}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ligar Agora ({COMPANY_INFO.mainPhone})</span>
                </a>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
