'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Eye,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, BannerItem, formatImageUrl } from '@/lib/api';

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Estado do Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 1,
    active: true,
    linkUrl: '',
    linkText: '',
  });

  // Query para buscar todos os banners (inclusive inativos)
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminBanners'],
    queryFn: adminApi.getBanners,
  });

  const banners: BannerItem[] = response?.data || [];

  // Mutação para Salvar (Criar ou Atualizar)
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingBanner?._id) {
        return adminApi.updateBanner(editingBanner._id, formData);
      } else {
        return adminApi.createBanner(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      queryClient.invalidateQueries({ queryKey: ['activeBanners'] });
      setSuccessMessage(editingBanner ? 'Banner atualizado com sucesso!' : 'Novo banner criado com sucesso!');
      setIsModalOpen(false);
      setEditingBanner(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar banner');
      setTimeout(() => setErrorMessage(''), 4000);
    },
  });

  // Mutação para Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      queryClient.invalidateQueries({ queryKey: ['activeBanners'] });
      setSuccessMessage('Banner removido com sucesso!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao remover banner');
      setTimeout(() => setErrorMessage(''), 4000);
    },
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '/images/Gemini_Generated_Image_ywuiheywuiheywui.jpg',
      order: banners.length + 1,
      active: true,
      linkUrl: '',
      linkText: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      order: banner.order,
      active: banner.active,
      linkUrl: banner.linkUrl || '',
      linkText: banner.linkText || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este banner do carrossel?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Gestão Visual do Site</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Banners Principais do Topo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie os slides do carrossel principal exibido logo abaixo da barra de navegação no site público.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Banner</span>
        </button>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Listagem de Banners */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Carregando banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-sm font-bold text-slate-700">Nenhum banner cadastrado no momento.</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Clique no botão acima para adicionar o primeiro slide do carrossel.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
          >
            Criar Primeiro Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const formattedImg = formatImageUrl(banner.imageUrl, '/images/Gemini_Generated_Image_ywuiheywuiheywui.jpg');
            return (
              <div
                key={banner._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-amber-400 transition-all"
              >
                <div>
                  {/* Pré-visualização da Imagem com Texto no Canto Superior Esquerdo */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${formattedImg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />

                    {/* Badge de Ordem e Status */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] backdrop-blur-md">
                        Ordem #{banner.order}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md ${
                          banner.active ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                        }`}
                      >
                        {banner.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {/* Visualização do Texto como aparece no topo esquerdo da página */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-start items-start text-left z-10">
                      <h3 className="text-lg font-black text-white leading-tight drop-shadow-md line-clamp-1">
                        {banner.title}
                      </h3>
                      <p className="text-xs font-medium text-emerald-400 drop-shadow-md line-clamp-2 mt-1">
                        {banner.description}
                      </p>
                    </div>
                  </div>

                  {/* Informações Detalhadas */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Título Principal
                      </span>
                      <p className="text-sm font-black text-slate-900 line-clamp-1">{banner.title}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Descrição
                      </span>
                      <p className="text-xs text-slate-600 line-clamp-2">{banner.description}</p>
                    </div>

                    {banner.linkUrl && (
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 truncate">
                        <ArrowRight className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{banner.linkText || 'Link'}: {banner.linkUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-amber-600" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner._id)}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                    title="Excluir Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Adicionar / Editar Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            
            {/* Header do Modal */}
            <div className="p-6 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black">
                  {editingBanner ? 'Editar Banner do Topo' : 'Novo Banner do Topo'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título Principal (H1 do Banner) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: TRR KRUPINSKI"
                  className="w-full text-sm font-black px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descrição (Texto Abaixo do Título) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Entregando qualidade a mais de 30 anos"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Caminho da Imagem ou Link do Google Drive *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Ex: /images/Gemini_Generated_Image_ywuiheywuiheywui.jpg ou link do Drive"
                  className="w-full text-xs font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Você pode usar fotos locais da pasta public (ex: <code>/images/Gemini_Generated_Image_ywuiheywuiheywui.jpg</code>, <code>/images/agro-harvest.jpg</code>) ou link do Google Drive.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status do Banner
                  </label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    className="w-full text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="true">Ativo (Exibido no site)</option>
                    <option value="false">Inativo (Oculto)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Texto do Botão (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="Ex: Saiba Mais"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Link de Destino (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="Ex: #sobre ou link de WhatsApp"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Botões do Rodapé do Modal */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>{editingBanner ? 'Salvar Alterações' : 'Criar Banner'}</span>
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
