'use client';

import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  Fuel,
  PhoneCall,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, FleetItem } from '@/lib/api';

// Componentes Oficiais Reais da Landing Page
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection, { ServiceItem } from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';

export default function AdminConteudoPage() {
  const queryClient = useQueryClient();
  
  // Conforme solicitado: já abre diretamente em "Ver Todas em Sequência" ('all')
  const [activeTab, setActiveTab] = useState<'all' | 'hero' | 'about' | 'services' | 'contact'>('all');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Estado do Hero (com suporte a imagem editável)
  const [heroContent, setHeroContent] = useState({
    headline: 'Combustível no Seu Tanque, Onde Sua Operação Estiver',
    subheadline:
      'Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e pontualidade máxima.',
    imageUrl: '/images/hero-truck.jpg',
  });

  // 2. Estado do Sobre (com suporte a imagem editável)
  const [aboutContent, setAboutContent] = useState({
    headline: 'Mais de 30 anos dedicados ao abastecimento de Rondônia e Mato Grosso',
    text1:
      'Fundada em março de 1995, a TRR KRUPINSKI é uma empresa de revenda de combustíveis e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.',
    text2:
      'Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, garantindo que sua safra e sua frota nunca fiquem paradas.',
    years: 30,
    bases: 4,
    punctuality: 100,
    compliance: 100,
    imageUrl: '/images/agro-harvest.jpg',
  });

  // 3. Estado dos Serviços
  const [servicesContent, setServicesContent] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      details: string | string[];
      iconName?: string;
    }>;
  }>({
    badge: 'O Que Oferecemos',
    title: 'Produtos e Soluções para Sua Operação',
    subtitle: 'Do fornecimento diário de diesel ao abastecimento direto em maquinários na lavoura.',
    items: [
      {
        iconName: 'Fuel',
        title: 'Óleo Diesel S-10 e S-500',
        description:
          'Fornecimento a granel com laudo de pureza e densidade. Combustível filtrado para máxima performance e proteção de motores agrícolas e rodoviários.',
        details: 'Óleo Diesel S-10 (Ultrabaixo teor de enxofre)\nÓleo Diesel S-500 para frotas pesadas\nEntrega direta no seu ponto de consumo',
      },
      {
        iconName: 'Truck',
        title: 'Abastecimento Direto na Lavoura',
        description:
          'Caminhões equipados com bombas abastecedoras digitais calibradas para abastecer tratores, colheitadeiras e frotas direto na frente de colheita.',
        details: 'Descarga rápida com medição certificada\nAtendimento no campo sem paralisar a safra\nFlexibilidade de horários e plantão contínuo',
      },
      {
        iconName: 'Droplets',
        title: 'Lubrificantes & Arla 32',
        description:
          'Linha completa de óleos lubrificantes minerais e sintéticos para transmissões, motores pesados, sistemas hidráulicos e graxas para rolamentos.',
        details: 'Óleos de alta performance multiviscosos\nFluidos hidráulicos e graxas especiais\nArla 32 certificado pelo Inmetro',
      },
      {
        iconName: 'ShieldCheck',
        title: 'Transporte Rodoviário Perigoso',
        description:
          'Logística especializada no transporte rodoviário de cargas perigosas com registro ativo na ANTT (RNTRC 001952720) e motoristas capacitados (MOPP).',
        details: 'Frota própria com rastreamento 24h via satélite\nCaminhões adequados para acessos rurais e vicinais\nAtendimento em todo Rondônia e Mato Grosso',
      },
    ],
  });

  // 4. Estado de Contato
  const [contactContent, setContactContent] = useState({
    badge: 'Atendimento',
    title: 'Entre em Contato com a TRR Krupinski',
    subtitle: 'Nossa equipe está pronta para atender seu pedido com rapidez e eficiência.',
    phone: '(69) 3322-1589',
    whatsapp: '5569999952942',
    email: 'contato@trrkrupinski.com.br',
    hours: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h (Plantão na Safra)',
  });

  // Carrega os dados de conteúdo E imagens das seções da frota do servidor
  const { isLoading } = useQuery({
    queryKey: ['adminContentAndFleet'],
    queryFn: async () => {
      const [contentRes, fleetRes] = await Promise.all([
        adminApi.getContent(),
        adminApi.getFleet().catch(() => ({ data: [] })),
      ]);

      const fleetItems: FleetItem[] = fleetRes?.data || [];
      const heroFleet = fleetItems.find((f) => f.category === 'hero');
      const sobreFleet = fleetItems.find((f) => f.category === 'sobre');

      if (contentRes.data) {
        if (contentRes.data.company_hero) {
          setHeroContent((prev) => ({
            ...prev,
            ...contentRes.data.company_hero,
            imageUrl: heroFleet?.imageUrl || prev.imageUrl,
          }));
        } else if (heroFleet) {
          setHeroContent((prev) => ({ ...prev, imageUrl: heroFleet.imageUrl }));
        }

        if (contentRes.data.company_about) {
          setAboutContent((prev) => ({
            ...prev,
            ...contentRes.data.company_about,
            imageUrl: sobreFleet?.imageUrl || prev.imageUrl,
          }));
        } else if (sobreFleet) {
          setAboutContent((prev) => ({ ...prev, imageUrl: sobreFleet.imageUrl }));
        }

        if (contentRes.data.company_services) {
          const s = contentRes.data.company_services;
          if (Array.isArray(s)) {
            setServicesContent((prev) => ({
              ...prev,
              items: s.map((it: any) => ({
                title: it.title || '',
                description: it.description || '',
                details: Array.isArray(it.details) ? it.details.join('\n') : (it.details || ''),
                iconName: it.iconName || 'Truck',
              })),
            }));
          } else if (s && typeof s === 'object') {
            setServicesContent((prev) => ({
              badge: s.badge || prev.badge,
              title: s.title || prev.title,
              subtitle: s.subtitle || prev.subtitle,
              items: Array.isArray(s.items)
                ? s.items.map((it: any) => ({
                    title: it.title || '',
                    description: it.description || '',
                    details: Array.isArray(it.details) ? it.details.join('\n') : (it.details || ''),
                    iconName: it.iconName || 'Truck',
                  }))
                : prev.items,
            }));
          }
        }
        if (contentRes.data.company_contact) {
          setContactContent((prev) => ({ ...prev, ...contentRes.data.company_contact }));
        }
      }
      return { content: contentRes.data || {}, fleet: fleetItems };
    },
  });

  // Salvar no backend tanto os textos quanto as imagens das seções
  const saveMutation = useMutation({
    mutationFn: async () => {
      const formattedServices = {
        badge: servicesContent.badge,
        title: servicesContent.title,
        subtitle: servicesContent.subtitle,
        items: servicesContent.items.map((it) => ({
          title: it.title,
          description: it.description,
          iconName: it.iconName || 'Truck',
          details: Array.isArray(it.details)
            ? it.details
            : typeof it.details === 'string'
            ? it.details.split('\n').map((l) => l.trim()).filter(Boolean)
            : [],
        })),
      };

      // 1. Salva os textos das seções
      const promises: Promise<any>[] = [
        adminApi.updateContent('company_hero', {
          headline: heroContent.headline,
          subheadline: heroContent.subheadline,
          imageUrl: heroContent.imageUrl,
        }),
        adminApi.updateContent('company_about', {
          headline: aboutContent.headline,
          text1: aboutContent.text1,
          text2: aboutContent.text2,
          years: aboutContent.years,
          bases: aboutContent.bases,
          punctuality: aboutContent.punctuality,
          compliance: aboutContent.compliance,
        }),
        adminApi.updateContent('company_services', formattedServices),
        adminApi.updateContent('company_contact', contactContent),
      ];

      // 2. Salva e sincroniza as imagens das seções no servidor (FleetItem)
      const fleetRes = await adminApi.getFleet().catch(() => ({ data: [] }));
      const fleetItems: FleetItem[] = fleetRes?.data || [];

      if (heroContent.imageUrl) {
        const existingHero = fleetItems.find((f) => f.category === 'hero');
        if (existingHero) {
          promises.push(adminApi.updateFleet(existingHero._id, { imageUrl: heroContent.imageUrl }));
        } else {
          promises.push(
            adminApi.createFleet({
              title: 'Caminhão Tanque (Banner Hero)',
              description: 'Caminhão em operação exibido no banner inicial do site',
              imageUrl: heroContent.imageUrl,
              category: 'hero',
              order: 1,
              active: true,
            })
          );
        }
      }

      if (aboutContent.imageUrl) {
        const existingSobre = fleetItems.find((f) => f.category === 'sobre');
        if (existingSobre) {
          promises.push(adminApi.updateFleet(existingSobre._id, { imageUrl: aboutContent.imageUrl }));
        } else {
          promises.push(
            adminApi.createFleet({
              title: 'Abastecimento na Colheita da Safra',
              description: 'Foto institucional em destaque na seção Sobre a Empresa',
              imageUrl: aboutContent.imageUrl,
              category: 'sobre',
              order: 1,
              active: true,
            })
          );
        }
      }

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContentAndFleet'] });
      queryClient.invalidateQueries({ queryKey: ['companyHero'] });
      queryClient.invalidateQueries({ queryKey: ['companyAbout'] });
      queryClient.invalidateQueries({ queryKey: ['companyServices'] });
      queryClient.invalidateQueries({ queryKey: ['companyContact'] });
      queryClient.invalidateQueries({ queryKey: ['activeFleet'] });
      queryClient.invalidateQueries({ queryKey: ['adminFleet'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      setSuccessMessage('Textos e imagens das seções salvos com sucesso no servidor e no site!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar alterações');
    },
  });

  const handleSave = () => {
    setSuccessMessage('');
    setErrorMessage('');
    saveMutation.mutate();
  };

  // Handlers para Hero
  const handleHeroChange = (field: 'headline' | 'subheadline' | 'imageUrl', value: string) => {
    setHeroContent((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers para About
  const handleAboutChange = (field: string, value: any) => {
    setAboutContent((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers para Services
  const handleServicesMetaChange = (field: 'badge' | 'title' | 'subtitle', value: string) => {
    setServicesContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceItemChange = (index: number, field: string, value: string) => {
    const updated = [...servicesContent.items];
    updated[index] = { ...updated[index], [field]: value };
    setServicesContent((prev) => ({ ...prev, items: updated }));
  };

  const handleAddService = () => {
    setServicesContent((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          title: 'Novo Serviço / Produto',
          description: 'Descreva os benefícios e atuação deste produto/serviço.',
          details: 'Diferencial 1\nDiferencial 2\nDiferencial 3',
          iconName: 'Truck',
        },
      ],
    }));
  };

  const handleRemoveService = (index: number) => {
    setServicesContent((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  // Handlers para Contact
  const handleContactChange = (field: 'badge' | 'title' | 'subtitle' | 'phone' | 'whatsapp' | 'email' | 'hours', value: string) => {
    setContactContent((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'all', label: 'Ver Todas em Sequência', icon: Layers },
    { id: 'hero', label: '1. Seção Inicial (Hero)', icon: Sparkles },
    { id: 'about', label: '2. Sobre a Empresa', icon: Building2 },
    { id: 'services', label: '3. Produtos & Serviços', icon: Fuel },
    { id: 'contact', label: '4. Contato & Atendimento', icon: PhoneCall },
  ] as const;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Barra de Controle Fixa no Topo */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Modo Edição Visual dos Componentes</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Textos e imagens são editáveis diretamente no layout real e salvos no servidor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-2xl border border-red-200 flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Seletor de Abas de Seções */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="font-semibold">Carregando componentes, fotos e textos...</span>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* 1. SEÇÃO HERO OFICIAL EM MODO EDITÁVEL */}
          {(activeTab === 'hero' || activeTab === 'all') && (
            <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Seção Inicial (HeroSection)</span>
                </span>
                <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Modo Editável (Textos & Imagem)
                </span>
              </div>

              <HeroSection
                isEditable={true}
                editableData={heroContent}
                onEditChange={handleHeroChange}
              />
            </div>
          )}

          {/* 2. SEÇÃO ABOUT OFICIAL EM MODO EDITÁVEL */}
          {(activeTab === 'about' || activeTab === 'all') && (
            <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-900">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Sobre a Empresa (AboutSection)</span>
                </span>
                <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Modo Editável (Textos, Imagem & Métricas)
                </span>
              </div>

              <AboutSection
                isEditable={true}
                editableData={aboutContent}
                onEditChange={handleAboutChange}
              />
            </div>
          )}

          {/* 3. SEÇÃO SERVICES OFICIAL EM MODO EDITÁVEL */}
          {(activeTab === 'services' || activeTab === 'all') && (
            <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-900">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  <span>Produtos e Serviços (ServicesSection)</span>
                </span>
                <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Modo Editável (Cards In-Place)
                </span>
              </div>

              <ServicesSection
                isEditable={true}
                editableData={servicesContent}
                onEditChange={handleServicesMetaChange}
                onItemChange={handleServiceItemChange}
                onAddItem={handleAddService}
                onRemoveItem={handleRemoveService}
              />
            </div>
          )}

          {/* 4. SEÇÃO CONTACT OFICIAL EM MODO EDITÁVEL */}
          {(activeTab === 'contact' || activeTab === 'all') && (
            <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-2 text-slate-900">
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <span>Contato e Atendimento (ContactSection)</span>
                </span>
                <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Modo Editável (Telefones & Horários)
                </span>
              </div>

              <ContactSection
                isEditable={true}
                editableData={contactContent}
                onEditChange={handleContactChange}
              />
            </div>
          )}

        </div>
      )}

      {/* Botão Flutuante de Salvar */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Salvando Alterações...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Salvar Alterações no Site</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
