'use client';

import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  Power,
  ExternalLink,
  Loader2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notice, adminApi, formatImageUrl } from '@/lib/api';
import AutoResizeTextarea from '@/components/AutoResizeTextarea';

export default function AdminAvisosPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State: Somente os campos essenciais solicitados
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    active: true,
  });

  // Query de Avisos
  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['adminNotices'],
    queryFn: adminApi.getNotices,
  });
  const notices: Notice[] = noticesData?.data || [];

  // Mutações
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formData.title,
        description: formData.description,
        message: formData.description, // compatibilidade
        imageUrl: formData.imageUrl,
        linkUrl: formData.linkUrl,
        linkText: formData.linkText,
        active: formData.active,
      };

      if (editingId) {
        return adminApi.updateNotice(editingId, payload);
      } else {
        return adminApi.createNotice(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotices'] });
      queryClient.invalidateQueries({ queryKey: ['activeNotices'] });
      setModalOpen(false);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar aviso');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotices'] });
      queryClient.invalidateQueries({ queryKey: ['activeNotices'] });
    },
    onError: (err: any) => {
      alert('Erro ao alternar status do aviso: ' + err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotices'] });
      queryClient.invalidateQueries({ queryKey: ['activeNotices'] });
    },
    onError: (err: any) => {
      alert('Erro ao excluir aviso: ' + err.message);
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '/images/agro-harvest.jpg',
      linkUrl: '',
      linkText: 'Saiba Mais',
      active: true,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingId(notice._id);
    setFormData({
      title: notice.title,
      description: notice.description || notice.message || '',
      imageUrl: notice.imageUrl || '',
      linkUrl: notice.linkUrl || '',
      linkText: notice.linkText || '',
      active: notice.active,
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
    if (!confirm(`Tem certeza que deseja excluir o aviso "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Quadro de Avisos & Notícias</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre notícias e comunicados que serão exibidos com fotos em destaque na página inicial.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Aviso / Notícia</span>
        </button>
      </div>

      {/* Lista de Avisos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span>Carregando avisos cadastrados...</span>
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Nenhum aviso cadastrado ainda. Clique em "Novo Aviso / Notícia" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-32">Foto</th>
                  <th className="py-3.5 px-4">Título & Descrição</th>
                  <th className="py-3.5 px-4">Botão de Ação</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Imagem em Destaque */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {notice.imageUrl ? (
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                          <img
                            src={formatImageUrl(notice.imageUrl)}
                            alt={notice.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>

                    {/* Título & Descrição */}
                    <td className="py-3.5 px-4 min-w-[300px]">
                      <div className="font-bold text-slate-900 text-sm">
                        {notice.title}
                      </div>
                      <div className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {notice.description || notice.message}
                      </div>
                    </td>

                    {/* Botão de Ação */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {notice.linkUrl ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                          <span>{notice.linkText || 'Acessar'}</span>
                          <ExternalLink className="w-3 h-3 text-amber-600" />
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Nenhum botão</span>
                      )}
                    </td>

                    {/* Status Ativo / Inativo */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(notice._id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          notice.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Clique para alternar visibilidade no site"
                      >
                        <Power className="w-3 h-3" />
                        <span>{notice.active ? 'Ativo no Site' : 'Pausado'}</span>
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(notice)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Editar aviso"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(notice._id, notice.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir aviso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Simplificado: Apenas Título, Descrição, Imagem e Botão de Ação */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Editar Aviso / Notícia' : 'Cadastrar Novo Aviso / Notícia'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              
              {/* Título */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Título / Manchete *
                </label>
                <AutoResizeTextarea
                  required
                  rows={1}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Plantão Safra 2026: Abastecimento Direto na Lavoura"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium shadow-xs"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Descrição / Texto do Aviso *
                </label>
                <AutoResizeTextarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva as informações do aviso de forma clara..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-xs"
                />
              </div>

              {/* Link da Foto / Imagem */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link da Foto em Destaque *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Ex: /images/agro-harvest.jpg ou URL direta da foto"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />

                {/* Prévia da Imagem em Destaque */}
                {formData.imageUrl && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700 mb-2">
                      Prévia da foto em destaque:
                    </div>
                    <div className="relative aspect-[16/9] max-h-48 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                      <img
                        src={formatImageUrl(formData.imageUrl)}
                        alt="Prévia"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Ação Opcional */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="block font-bold text-slate-800 text-[11px]">
                  Botão de Ação (Opcional)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">
                      Link / URL (ou WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="https://wa.me/... ou #produtos"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      placeholder="Ex: Solicitar Abastecimento"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox Ativo */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeNoticeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="activeNoticeCheck" className="font-bold text-slate-700 cursor-pointer">
                  Exibir imediatamente no site
                </label>
              </div>

              {/* Rodapé do Modal */}
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
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Atualizar Aviso' : 'Salvar Aviso'}</span>
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
