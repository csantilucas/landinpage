'use client';

import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Power,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notice, adminApi } from '@/lib/api';

export default function AdminAvisosPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Notice['type'],
    active: true,
    priority: 0,
    imageUrl: '',
    linkUrl: '',
    linkText: '',
  });

  // Query com TanStack Query
  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['adminNotices'],
    queryFn: adminApi.getNotices,
  });
  const notices: Notice[] = noticesData?.data || [];

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return adminApi.updateNotice(editingId, formData);
      } else {
        return adminApi.createNotice(formData);
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
      message: '',
      type: 'alert',
      active: true,
      priority: 0,
      imageUrl: '',
      linkUrl: '',
      linkText: 'Saiba Mais',
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingId(notice._id);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type,
      active: notice.active,
      priority: notice.priority || 0,
      imageUrl: notice.imageUrl || '',
      linkUrl: notice.linkUrl || '',
      linkText: notice.linkText || '',
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    saveMutation.mutate();
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o aviso "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  const getTypeBadge = (type: Notice['type']) => {
    switch (type) {
      case 'alert':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Alerta / Plantão
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
            <Bell className="w-3 h-3 text-amber-600" />
            Importante
          </span>
        );
      case 'success':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Sucesso
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
            <Info className="w-3 h-3 text-blue-600" />
            Informativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Gerenciamento de Avisos & Plantões
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre comunicados que aparecem na barra superior da landing page para os visitantes.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Aviso</span>
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
            Nenhum aviso cadastrado ainda. Clique em "Criar Novo Aviso" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Título & Mensagem</th>
                  <th className="py-3.5 px-4">Link de Ação</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Status Ativo / Inativo */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggle(notice._id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          notice.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Clique para alternar status"
                      >
                        <Power className="w-3 h-3" />
                        <span>{notice.active ? 'Ativo no Site' : 'Pausado'}</span>
                      </button>
                    </td>

                    {/* Tipo */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getTypeBadge(notice.type)}
                    </td>

                    {/* Título & Mensagem */}
                    <td className="py-4 px-4 min-w-[280px]">
                      <div className="flex items-start gap-3">
                        {notice.imageUrl && (
                          <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                            <img
                              src={notice.imageUrl}
                              alt={notice.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {notice.title}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                            {notice.message}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Link */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {notice.linkUrl ? (
                        <a
                          href={notice.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-600 hover:underline font-semibold"
                        >
                          <span>{notice.linkText || 'Ver link'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Sem link</span>
                      )}
                    </td>

                    {/* Botões de Ação */}
                    <td className="py-4 px-4 whitespace-nowrap text-right space-x-1">
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

      {/* Modal de Criação / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Editar Aviso' : 'Criar Novo Aviso'}
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
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Título do Aviso *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Plantão Safra 2026 Ativo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mensagem Explicativa *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ex: Abastecimento in loco prioritário para colheitadeiras e frotas agrícolas..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tipo Visual
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  <option value="alert">Alerta / Plantão (Âmbar)</option>
                  <option value="warning">Comunicado Importante</option>
                  <option value="info">Aviso Oficial (Neutro)</option>
                  <option value="success">Informativo (Verde)</option>
                </select>
              </div>

              {/* Link da Imagem do Aviso */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link da Imagem / Banner do Aviso (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Ex: /images/frota1.jpeg ou link direto de foto"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />

                {/* Prévia da Imagem em Tempo Real */}
                {formData.imageUrl && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Prévia"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold block text-slate-800">Prévia da imagem</span>
                      <span className="text-slate-400 truncate block max-w-xs">{formData.imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Link de Ação (URL ou WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://wa.me/... ou #produtos"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="Ex: Chamar no WhatsApp"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="activeCheck" className="font-bold text-slate-700 cursor-pointer">
                  Exibir imediatamente no site
                </label>
              </div>

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
