'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Phone, MessageSquare, Check, Copy } from 'lucide-react';
import { OPERATIONAL_BASES, COMPANY_INFO } from '@/data/companyData';

export default function CompanyMap() {
  const [selectedBaseId, setSelectedBaseId] = useState<string>('vilhena');
  const [copiedCoords, setCopiedCoords] = useState(false);

  const currentBase = OPERATIONAL_BASES.find((b) => b.id === selectedBaseId) || OPERATIONAL_BASES[0];

  const handleCopyCoords = () => {
    if (currentBase.coordinates) {
      const coordsText = `${currentBase.coordinates.lat}, ${currentBase.coordinates.lng}`;
      navigator.clipboard.writeText(coordsText);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  return (
    <div className="mt-14 bg-slate-50 text-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Subtle ambient light gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-md mb-2 border border-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Localização no Google Maps</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Como Chegar às Nossas Unidades
          </h3>
          <p className="text-slate-600 text-sm mt-1 max-w-xl">
            Selecione uma base abaixo para visualizar no mapa interativo, traçar rota no GPS ou abrir diretamente no Google Maps e Waze.
          </p>
        </div>

        {/* Base Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {OPERATIONAL_BASES.map((b) => {
            const isSelected = b.id === selectedBaseId;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBaseId(b.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-600'}`} />
                <span>{b.city} ({b.state})</span>
                {b.id === 'vilhena' && (
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-black ${isSelected ? 'bg-slate-950 text-amber-400' : 'bg-amber-100 text-amber-800'}`}>
                    Matriz
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Content & Info Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
        
        {/* Left Side: Info and Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  {currentBase.type}
                </span>
                {currentBase.id === 'vilhena' && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                    Sede Administrativa
                  </span>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {currentBase.name}
              </h4>
              <p className="text-sm text-slate-700 mt-2 flex items-start gap-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{currentBase.address}</span>
              </p>
            </div>

            {/* Coordinates badge if available */}
            {currentBase.coordinates && (
              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-xs">
                <span className="font-mono text-[11px] text-slate-700 font-semibold">
                  GPS: {currentBase.coordinates.lat}, {currentBase.coordinates.lng}
                </span>
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar GPS</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Coverage */}
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Área de Cobertura e Atendimento:</span>
              <p className="text-slate-600">{currentBase.coverage}</p>
            </div>

            {/* Contact Phones */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Atendimento Telefônico:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentBase.phones.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 hover:text-amber-700 transition-colors border border-slate-200 shadow-xs"
                  >
                    <Phone className="w-3 h-3 text-amber-600" />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Route, Waze, WhatsApp */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <a
              href={
                currentBase.id === 'vilhena'
                  ? COMPANY_INFO.googleMapsRouteUrl
                  : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentBase.address)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm shadow-amber-400/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Traçar Rota no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={currentBase.wazeUrl || `https://www.waze.com/ul?q=${encodeURIComponent(currentBase.address)}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center gap-1.5 border border-slate-200 transition-colors shadow-xs"
              >
                <span>Navegar via Waze</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://wa.me/${currentBase.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de falar com o atendimento da Base ${currentBase.city} - ${currentBase.state} da TRR Krupinski.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3 h-3 fill-current" />
                <span>WhatsApp Base</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Side: Embedded Google Map */}
        <div className="lg:col-span-7 min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
          <iframe
            key={currentBase.id}
            src={currentBase.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '100%', width: '100%' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de Localização - ${currentBase.name}`}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute top-3 right-3 z-10">
            <a
              href={currentBase.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 hover:bg-white text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all backdrop-blur-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver no Google Maps</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
