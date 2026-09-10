'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Bell,
  Building2,
  Truck,
  Fuel,
  MapPin,
  PhoneCall,
  Info,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, SectionOrderItem } from '@/lib/api';

const DEFAULT_SECTIONS: SectionOrderItem[] = [
  {
    id: 'hero',
    name: 'Seção Inicial (Hero)',
    description: 'Destaque com chamada principal, proposta de valor e botões rápidos de cotação.',
    enabled: true,
    order: 1,
  },
  {
    id: 'notices',
    name: 'Carrossel de Avisos & Plantão',
    description: 'Carrossel dinâmico com comunicados urgentes, plantão de safra e alertas da empresa.',
    enabled: true,
    order: 2,
  },
  {
    id: 'about',
    name: 'A Empresa & Métricas de Confiança',
    description: 'História de 30 anos, pontualidade, bases estratégicas e conformidade ANP.',
    enabled: true,
    order: 3,
  },
  {
    id: 'fleet',
    name: 'Nossa Frota (Carrossel)',
    description: 'Carrossel visual interativo com fotos e links dos caminhões de entrega.',
    enabled: true,
    order: 4,
  },
  {
    id: 'services',
    name: 'Produtos e Serviços',
    description: 'Diesel S-10, Diesel S-500, Lubrificantes, Arla 32 e Abastecimento na Lavoura.',
    enabled: true,
    order: 5,
  },
  {
    id: 'bases',
    name: 'Bases Operacionais & Mapa',
    description: 'Localização no Google Maps de Vilhena, Comodoro, Parecis e Aripuanã.',
    enabled: true,
    order: 6,
  },
  {
    id: 'contact',
    name: 'Contato & Cotação Rápida',
    description: 'Formulário de cotação direta e canais de WhatsApp das bases.',
    enabled: true,
    order: 7,
  },
];

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <Sparkles className="w-5 h-5 text-amber-500" />,
  notices: <Bell className="w-5 h-5 text-rose-500" />,
  about: <Building2 className="w-5 h-5 text-amber-600" />,
  fleet: <Truck className="w-5 h-5 text-blue-500" />,
  services: <Fuel className="w-5 h-5 text-emerald-500" />,
  bases: <MapPin className="w-5 h-5 text-orange-500" />,
  contact: <PhoneCall className="w-5 h-5 text-indigo-500" />,
};

export default function AdminSecoesPage() {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<SectionOrderItem[]>(DEFAULT_SECTIONS);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Carrega a ordem salva no backend
  const { isLoading } = useQuery({
    queryKey: ['adminSectionsOrder'],
    queryFn: async () => {
      const res = await adminApi.getContent();
      if (res.data && Array.isArray(res.data.sections_order) && res.data.sections_order.length > 0) {
        // Assegura que todas as seções conhecidas estão presentes
        const saved: SectionOrderItem[] = res.data.sections_order;
        const savedIds = new Set(saved.map((s) => s.id));
        const missing = DEFAULT_SECTIONS.filter((d) => !savedIds.has(d.id));
        const fullList = [...saved, ...missing].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSections(fullList);
        return fullList;
      }
      setSections(DEFAULT_SECTIONS);
      return DEFAULT_SECTIONS;
    },
  });

  // Mutação para salvar a ordem
  const saveMutation = useMutation({
    mutationFn: async (updatedList: SectionOrderItem[]) => {
      const normalized = updatedList.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      await adminApi.updateContent('sections_order', normalized);
      return normalized;
    },
    onSuccess: (savedList) => {
      setSections(savedList);
      queryClient.invalidateQueries({ queryKey: ['adminSectionsOrder'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsOrder'] });
      setSuccessMessage('Ordem e visibilidade das seções salvas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar ordem das seções.');
    },
  });

  // Mover para cima
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...sections];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(reordered);
  };

  // Mover para baixo
  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newItems = [...sections];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(reordered);
  };

  // Alternar ativo/inativo
  const handleToggle = (id: string) => {
    if (id === 'notices') {
      alert('A seção de Avisos e Plantão é permanente e não pode ser removida da página.');
      return;
    }
    const updated = sections.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setSections(updated);
  };

  // Restaurar padrão
  const handleReset = () => {
    if (confirm('Deseja restaurar a ordem original padrão das seções da landing page?')) {
      setSections(DEFAULT_SECTIONS);
      saveMutation.mutate(DEFAULT_SECTIONS);
    }
  };

  // Drag & Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...sections];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSections(newItems.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-500" />
            <span>Layout & Ordenação de Seções (Kanban Vertical)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Arraste os cards ou utilize as setas para definir a ordem exata em que as seções aparecem na landing page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            title="Restaurar posições originais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={() => saveMutation.mutate(sections)}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando Ordem...</span>
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

      {/* Dica de uso */}
      <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Como funciona a personalização de layout?</p>
          <p className="text-amber-800/90 leading-relaxed">
            Cada card abaixo representa um bloco da página principal. Você pode desativar seções clicando no ícone do olho
            (por exemplo, para pausar o carrossel de avisos temporariamente) ou mover a seção para cima/baixo para mudar sua prioridade visual.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>Carregando disposição das seções...</span>
        </div>
      ) : (
        /* Lista Vertical de Cards Kanban */
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isFirst = index === 0;
            const isLast = index === sections.length - 1;
            const isDragging = draggedIndex === index;

            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  section.enabled
                    ? 'bg-white border-slate-200/90 shadow-xs hover:border-amber-400/60 hover:shadow-md'
                    : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                } ${isDragging ? 'ring-2 ring-amber-500 bg-amber-50/50 scale-[1.01]' : ''}`}
              >
                {/* Lado Esquerdo: Grip + Posição + Ícone + Textos */}
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                  {/* Grip Handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700 hidden sm:block"
                    title="Arraste para reposicionar"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Badge de Posição */}
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                    #{index + 1}
                  </div>

                  {/* Ícone da Seção */}
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 border border-slate-200/60">
                    {SECTION_ICONS[section.id] || <Layers className="w-5 h-5 text-slate-500" />}
                  </div>

                  {/* Informações da Seção */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-black text-slate-900 tracking-tight">
                        {section.name}
                      </h2>
                      {section.enabled ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Exibida no Site
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                          Ocultada
                        </span>
                      )}
                    </div>
                    {section.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Ações (Toggle + Subir + Descer) */}
                <div className="flex items-center justify-end gap-2 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Botão de Visibilidade */}
                  <button
                    type="button"
                    onClick={() => handleToggle(section.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      section.enabled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                    title={section.enabled ? 'Ocultar esta seção' : 'Ativar esta seção'}
                  >
                    {section.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Oculta</span>
                      </>
                    )}
                  </button>

                  <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                  {/* Botão Subir */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-700"
                    title="Mover para cima"
                    aria-label={`Mover ${section.name} para cima`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  {/* Botão Descer */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-700"
                    title="Mover para baixo"
                    aria-label={`Mover ${section.name} para baixo`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prévia da Ordem - Estilo Claro */}
      <div className="p-5 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Estrutura Final na Landing Page:
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {sections
            .filter((s) => s.enabled)
            .map((s, idx) => (
              <React.Fragment key={s.id}>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  {idx + 1}. {s.name}
                </span>
                {idx < sections.filter((s) => s.enabled).length - 1 && (
                  <span className="text-amber-500 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
