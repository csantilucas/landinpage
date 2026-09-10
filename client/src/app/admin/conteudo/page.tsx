'use client';

import React, { useState } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  Fuel,
  PhoneCall,
  Plus,
  Trash2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

interface ServiceItemState {
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export default function AdminConteudoPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'contact'>('hero');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Hero Content
  const [heroContent, setHeroContent] = useState({
    badge: '30+ Anos de Tradição e Excelência',
    headline: 'Combustível no Seu Tanque, Onde Sua Operação Estiver',
    subheadline:
      'Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e pontualidade máxima.',
  });

  // 2. About Content
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
  });

  // 3. Services Content
  const [servicesContent, setServicesContent] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    items: ServiceItemState[];
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

  // 4. Contact Content
  const [contactContent, setContactContent] = useState({
    phone: '(69) 3322-1100',
    whatsapp: '556933221100',
    email: 'contato@trrkrupinski.com.br',
    hours: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h',
  });

  // Carrega todos os conteúdos salvos
  const { isLoading } = useQuery({
    queryKey: ['adminContent'],
    queryFn: async () => {
      const res = await adminApi.getContent();
      if (res.data) {
        if (res.data.company_hero) {
          setHeroContent((prev) => ({ ...prev, ...res.data.company_hero }));
        }
        if (res.data.company_about) {
          setAboutContent((prev) => ({ ...prev, ...res.data.company_about }));
        }
        if (res.data.company_services) {
          const s = res.data.company_services;
          if (Array.isArray(s)) {
            setServicesContent((prev) => ({
              ...prev,
              items: s.map((it: any) => ({
                title: it.title || '',
                description: it.description || '',
                details: Array.isArray(it.details) ? it.details.join('\n') : '',
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
                    details: Array.isArray(it.details) ? it.details.join('\n') : '',
                    iconName: it.iconName || 'Truck',
                  }))
                : prev.items,
            }));
          }
        }
        if (res.data.company_contact) {
          setContactContent((prev) => ({ ...prev, ...res.data.company_contact }));
        }
      }
      return res.data || {};
    },
  });

  // Mutação para salvar tudo
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Formata itens de serviço com array de detalhes
      const formattedServices = {
        badge: servicesContent.badge,
        title: servicesContent.title,
        subtitle: servicesContent.subtitle,
        items: servicesContent.items.map((it) => ({
          title: it.title,
          description: it.description,
          iconName: it.iconName,
          details: it.details
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean),
        })),
      };

      await Promise.all([
        adminApi.updateContent('company_hero', heroContent),
        adminApi.updateContent('company_about', aboutContent),
        adminApi.updateContent('company_services', formattedServices),
        adminApi.updateContent('company_contact', contactContent),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContent'] });
      queryClient.invalidateQueries({ queryKey: ['companyHero'] });
      queryClient.invalidateQueries({ queryKey: ['companyAbout'] });
      queryClient.invalidateQueries({ queryKey: ['companyServices'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      setSuccessMessage('Todos os textos e métricas do site foram atualizados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar conteúdos');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    saveMutation.mutate();
  };

  const handleAddService = () => {
    setServicesContent({
      ...servicesContent,
      items: [
        ...servicesContent.items,
        {
          title: 'Novo Serviço / Produto',
          description: 'Descreva os benefícios e a atuação deste produto/serviço.',
          details: 'Diferencial 1\nDiferencial 2\nDiferencial 3',
          iconName: 'Truck',
        },
      ],
    });
  };

  const handleRemoveService = (idx: number) => {
    setServicesContent({
      ...servicesContent,
      items: servicesContent.items.filter((_, i) => i !== idx),
    });
  };

  const handleServiceChange = (idx: number, field: keyof ServiceItemState, value: string) => {
    const updated = [...servicesContent.items];
    updated[idx] = { ...updated[idx], [field]: value };
    setServicesContent({ ...servicesContent, items: updated });
  };

  const tabs = [
    { id: 'hero', label: '1. Seção Inicial (Hero)', icon: Sparkles },
    { id: 'about', label: '2. Sobre & Métricas', icon: Building2 },
    { id: 'services', label: '3. Produtos & Serviços', icon: Fuel },
    { id: 'contact', label: '4. Contato & Plantão', icon: PhoneCall },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>Gerenciamento de Textos & Conteúdo das Seções</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalize textos, títulos, métricas institucionais e produtos sem mexer em código.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Todos os Textos</span>
            </>
          )}
        </button>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navegação de Abas */}
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
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>Carregando textos cadastrados no banco...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Seção Inicial (Hero Section)</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selo / Badge de Destaque
                </label>
                <input
                  type="text"
                  value={heroContent.badge}
                  onChange={(e) => setHeroContent({ ...heroContent, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título Principal (Headline)
                </label>
                <input
                  type="text"
                  value={heroContent.headline}
                  onChange={(e) => setHeroContent({ ...heroContent, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo / Descrição de Destaque
                </label>
                <textarea
                  rows={3}
                  value={heroContent.subheadline}
                  onChange={(e) => setHeroContent({ ...heroContent, subheadline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SOBRE A EMPRESA & MÉTRICAS */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Sobre a Empresa & Contadores de Confiança</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Seção Sobre
                </label>
                <input
                  type="text"
                  value={aboutContent.headline}
                  onChange={(e) => setAboutContent({ ...aboutContent, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primeiro Parágrafo (História)
                  </label>
                  <textarea
                    rows={4}
                    value={aboutContent.text1}
                    onChange={(e) => setAboutContent({ ...aboutContent, text1: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Segundo Parágrafo (Atuação Regional)
                  </label>
                  <textarea
                    rows={4}
                    value={aboutContent.text2}
                    onChange={(e) => setAboutContent({ ...aboutContent, text2: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Métricas e Contadores */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                  Contadores e Indicadores Numéricos (Exibidos em destaque na página)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Anos de Tradição
                    </label>
                    <input
                      type="number"
                      value={aboutContent.years}
                      onChange={(e) =>
                        setAboutContent({ ...aboutContent, years: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Qtd. Bases Próprias
                    </label>
                    <input
                      type="number"
                      value={aboutContent.bases}
                      onChange={(e) =>
                        setAboutContent({ ...aboutContent, bases: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      % Pontualidade Safra
                    </label>
                    <input
                      type="number"
                      value={aboutContent.punctuality}
                      onChange={(e) =>
                        setAboutContent({ ...aboutContent, punctuality: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      % Conformidade ANP
                    </label>
                    <input
                      type="number"
                      value={aboutContent.compliance}
                      onChange={(e) =>
                        setAboutContent({ ...aboutContent, compliance: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUTOS E SERVIÇOS */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  <span>Cabeçalho da Seção de Produtos e Serviços</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selo Superior (Badge)
                    </label>
                    <input
                      type="text"
                      value={servicesContent.badge}
                      onChange={(e) =>
                        setServicesContent({ ...servicesContent, badge: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={servicesContent.title}
                      onChange={(e) =>
                        setServicesContent({ ...servicesContent, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtítulo / Descrição da Seção
                  </label>
                  <input
                    type="text"
                    value={servicesContent.subtitle}
                    onChange={(e) =>
                      setServicesContent({ ...servicesContent, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Cards de cada Produto/Serviço */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Cards de Serviços Cadastrados ({servicesContent.items.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Novo Card</span>
                  </button>
                </div>

                {servicesContent.items.map((srv, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {srv.title || 'Serviço sem título'}
                        </span>
                      </div>

                      {servicesContent.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Excluir este serviço"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Título do Produto/Serviço
                        </label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Ícone Visual
                        </label>
                        <select
                          value={srv.iconName}
                          onChange={(e) => handleServiceChange(idx, 'iconName', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Fuel">Fuel (Combustível)</option>
                          <option value="Truck">Truck (Caminhão / Entrega)</option>
                          <option value="Droplets">Droplets (Lubrificantes / Arla)</option>
                          <option value="ShieldCheck">ShieldCheck (Segurança / ANTT)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Descrição Resumida
                      </label>
                      <textarea
                        rows={2}
                        value={srv.description}
                        onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Diferenciais / Lista de Tópicos (1 por linha)
                      </label>
                      <textarea
                        rows={3}
                        value={srv.details}
                        onChange={(e) => handleServiceChange(idx, 'details', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTATO & PLANTÃO */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                <span>Canais de Atendimento & Plantão</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone Fixo da Matriz
                  </label>
                  <input
                    type="text"
                    value={contactContent.phone}
                    onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Oficial (número completo com DDD)
                  </label>
                  <input
                    type="text"
                    value={contactContent.whatsapp}
                    onChange={(e) =>
                      setContactContent({ ...contactContent, whatsapp: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    value={contactContent.email}
                    onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário de Atendimento e Plantão
                  </label>
                  <input
                    type="text"
                    value={contactContent.hours}
                    onChange={(e) => setContactContent({ ...contactContent, hours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botão de Salvar no Rodapé do Form */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Textos...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Todos os Textos</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
