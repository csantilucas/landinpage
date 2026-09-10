'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  X,
  Power,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building2,
  Fuel,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FleetItem, adminApi } from '@/lib/api';

interface SectionConfig {
  id: string;
  name: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS_CONFIG: SectionConfig[] = [
  {
    id: 'carrossel',
    name: 'Carrossel da Frota (Fotos dos Caminhões)',
    description: 'Imagens rotativas exibidas no carrossel de fotos dos veículos na página inicial.',
    badge: 'Carrossel',
    icon: Layers,
  },
  {
    id: 'hero',
    name: 'Banner Inicial (Hero Section)',
    description: 'Imagem de destaque do caminhão tanque exibida na primeira dobra da página.',
    badge: 'Hero',
    icon: Sparkles,
  },
  {
    id: 'sobre',
    name: 'Sobre a Empresa (Foto da Safra / Lavoura)',
    description: 'Foto institucional da colheita ao lado do histórico e contadores de tradição.',
    badge: 'Sobre',
    icon: Building2,
  },
  {
    id: 'servicos',
    name: 'Cards de Produtos & Serviços',
    description: 'Fotos e ilustrações complementares dos cards de fornecimento, diesel e transporte.',
    badge: 'Cards',
    icon: Fuel,
  },
  {
    id: 'geral',
    name: 'Geral / Outras Imagens',
    description: 'Imagens institucionais, logotipos ou banners secundários do site.',
    badge: 'Geral',
    icon: ImageIcon,
  },
];

export default function AdminImagensPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado dos acordeões (dropdowns de abrir/esconder cada seção)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    carrossel: true,
    hero: true,
    sobre: true,
    servicos: true,
    geral: true,
  });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'carrossel',
    order: 1,
    active: true,
  });

  // Query de todas as imagens cadastradas
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ['adminFleet'],
    queryFn: adminApi.getFleet,
  });
  const allImages: FleetItem[] = fleetData?.data || [];

  // Mutações
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return adminApi.updateFleet(editingId, formData);
      } else {
        return adminApi.createFleet(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFleet'] });
      queryClient.invalidateQueries({ queryKey: ['activeFleet'] });
      setModalOpen(false);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar imagem');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (item: FleetItem) => adminApi.updateFleet(item._id, { active: !item.active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFleet'] });
      queryClient.invalidateQueries({ queryKey: ['activeFleet'] });
    },
    onError: (err: any) => {
      alert('Erro ao alternar visibilidade: ' + err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteFleet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFleet'] });
      queryClient.invalidateQueries({ queryKey: ['activeFleet'] });
    },
    onError: (err: any) => {
      alert('Erro ao excluir imagem: ' + err.message);
    },
  });

  // Alterna o dropdown de abrir/esconder a seção
  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Abre modal com a seção pré-definida
  const openCreateModalForSection = (sectionId: string) => {
    setEditingId(null);
    const count = allImages.filter((img) => (img.category || 'carrossel') === sectionId).length;
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: sectionId,
      order: count + 1,
      active: true,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (item: FleetItem) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category || 'carrossel',
      order: item.order || 1,
      active: item.active ?? true,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    saveMutation.mutate();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir a imagem "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            <span>Gerenciamento de Imagens do Site</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cada seção da página possui sua própria lista. Abra ou recolha os dropdowns abaixo e cadastre imagens diretamente para cada local.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const allOpen = Object.values(expandedSections).every(Boolean);
              setExpandedSections({
                carrossel: !allOpen,
                hero: !allOpen,
                sobre: !allOpen,
                servicos: !allOpen,
                geral: !allOpen,
              });
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {Object.values(expandedSections).every(Boolean) ? 'Recolher Todas' : 'Expandir Todas'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>Carregando imagens cadastradas...</span>
        </div>
      ) : (
        /* Lista de Seções com Dropdown / Acordeão para Cada Uma */
        <div className="space-y-4">
          {SECTIONS_CONFIG.map((sec) => {
            const Icon = sec.icon;
            const isExpanded = !!expandedSections[sec.id];
            const sectionImages = allImages.filter((item) => {
              const cat = item.category || 'carrossel';
              return cat === sec.id;
            });

            return (
              <div
                key={sec.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Cabeçalho / Label da Seção com Botão de Cadastro e Dropdown */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-100">
                  
                  {/* Informações da Label */}
                  <div
                    onClick={() => toggleSectionExpand(sec.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-amber-600 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                          {sec.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                          {sectionImages.length} {sectionImages.length === 1 ? 'imagem' : 'imagens'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  {/* Ações da Label: Botão Cadastrar neste Local + Seta do Dropdown */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => openCreateModalForSection(sec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar nesta Seção</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSectionExpand(sec.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 transition-colors"
                      title={isExpanded ? 'Esconder imagens' : 'Aparecer imagens'}
                      aria-label={`Alternar exibição de ${sec.name}`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                </div>

                {/* Conteúdo Expansível (Dropdown de Imagens da Seção) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5">
                    {sectionImages.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="font-semibold text-slate-600">
                          Nenhuma imagem cadastrada para esta seção
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Clique em "Cadastrar nesta Seção" acima para adicionar a primeira imagem deste local.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sectionImages.map((img) => (
                          <div
                            key={img._id}
                            className={`bg-white rounded-xl border overflow-hidden transition-all flex flex-col ${
                              img.active
                                ? 'border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md'
                                : 'border-dashed border-slate-300 opacity-60'
                            }`}
                          >
                            {/* Preview da Foto */}
                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden group">
                              <img
                                src={img.imageUrl}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />

                              <div className="absolute top-2 right-2">
                                <button
                                  type="button"
                                  onClick={() => toggleMutation.mutate(img)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs transition-colors ${
                                    img.active
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-slate-800 text-white'
                                  }`}
                                  title="Alternar visibilidade no site"
                                >
                                  {img.active ? 'Ativa' : 'Pausada'}
                                </button>
                              </div>
                            </div>

                            {/* Detalhes */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                              <div>
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                                  {img.title}
                                </h3>
                                {img.description && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                    {img.description}
                                  </p>
                                )}
                                <p className="text-[10px] font-mono text-slate-400 truncate mt-1" title={img.imageUrl}>
                                  {img.imageUrl}
                                </p>
                              </div>

                              {/* Ações */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                  #{img.order || 1}
                                </span>

                                <div className="flex items-center gap-1">
                                  <a
                                    href={img.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                    title="Abrir foto original"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(img)}
                                    className="p-1 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                                    title="Editar imagem"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(img._id, img.title)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    title="Excluir imagem"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edição com Prévia em Tempo Real */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <span>{editingId ? 'Editar Imagem' : 'Cadastrar Nova Imagem'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Dropdown da Seção / Local */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Local / Seção de Destino na Página *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  {SECTIONS_CONFIG.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Título / Identificação da Imagem *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Bitrem Tanque Volvo em Operação"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Link com Visualização em Tempo Real */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link Direto da Imagem (URL ou caminho interno) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Ex: /images/frota1.jpeg ou https://site.com/foto.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />

                {/* Prévia da Imagem em Tempo Real */}
                {formData.imageUrl && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Visualização Prévia da Imagem:</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Link Inserido</span>
                      </span>
                    </div>

                    <div className="relative aspect-[16/9] max-h-48 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center">
                      <img
                        src={formData.imageUrl}
                        alt="Prévia da foto"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {formData.imageUrl}
                    </p>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Legenda / Descrição Opcional
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes ou legenda explicativa da foto..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Ordem */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Checkbox Ativo */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeImgCheckModal"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="activeImgCheckModal" className="font-bold text-slate-700 cursor-pointer">
                  Exibir esta imagem imediatamente no site
                </label>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando Imagem...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Atualizar Imagem' : 'Salvar Imagem'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
