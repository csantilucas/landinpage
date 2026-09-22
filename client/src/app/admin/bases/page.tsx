'use client';

import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, OperationalBase } from '@/lib/api';
import { FALLBACK_BASES } from '@/data/fallbackData';

export default function AdminBasesPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBase, setEditingBase] = useState<OperationalBase | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    state: 'RO',
    type: 'Base Operacional',
    address: '',
    phonesText: '',
    whatsappNumber: '',
    whatsappDisplay: '',
    coverage: '',
    googleMapsUrl: '',
    embedUrl: '',
    order: 1,
    active: true,
  });

  // Query para buscar bases da API
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminBases'],
    queryFn: adminApi.getBases,
  });

const bases: OperationalBase[] = Array.isArray(response?.data) ? response.data : [];

  // Mutação para Salvar
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Partial<OperationalBase> = {
        name: formData.name.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        type: formData.type.trim(),
        address: formData.address.trim(),
        phones: formData.phonesText
          .split(/[\n,]+/)
          .map((p) => p.trim())
          .filter(Boolean),
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, ''),
        whatsappDisplay: formData.whatsappDisplay.trim() || formData.whatsappNumber.trim(),
        coverage: formData.coverage.trim(),
        googleMapsUrl: formData.googleMapsUrl.trim(),
        embedUrl: formData.embedUrl.trim(),
        order: Number(formData.order) || 1,
      };

      if (editingBase) {
        const idToUpdate = (editingBase as any)._id || editingBase.id;
        return adminApi.updateBase(idToUpdate, payload);
      } else {
        const slug = formData.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
        return adminApi.createBase({ ...payload, id: slug });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBases'] });
      queryClient.invalidateQueries({ queryKey: ['activeBases'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      setSuccessMessage(editingBase ? 'Base operacional atualizada com sucesso!' : 'Nova base adicionada com sucesso!');
      setIsModalOpen(false);
      setEditingBase(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao salvar base operacional');
      setTimeout(() => setErrorMessage(''), 4000);
    },
  });

  // Mutação para Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBases'] });
      queryClient.invalidateQueries({ queryKey: ['activeBases'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      setSuccessMessage('Base operacional removida com sucesso!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Falha ao remover base');
      setTimeout(() => setErrorMessage(''), 4000);
    },
  });

  const handleOpenCreate = () => {
    setEditingBase(null);
    setFormData({
      id: '',
      name: '',
      city: '',
      state: 'RO',
      type: 'Base Operacional',
      address: '',
      phonesText: '',
      whatsappNumber: '5569999952942',
      whatsappDisplay: '(69) 99995-2942',
      coverage: '',
      googleMapsUrl: '',
      embedUrl: '',
      order: bases.length + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (base: OperationalBase) => {
    setEditingBase(base);
    setFormData({
      id: base.id,
      name: base.name,
      city: base.city,
      state: base.state,
      type: base.type,
      address: base.address,
      phonesText: (base.phones || []).join(', '),
      whatsappNumber: base.whatsappNumber,
      whatsappDisplay: base.whatsappDisplay,
      coverage: base.coverage || '',
      googleMapsUrl: base.googleMapsUrl || '',
      embedUrl: base.embedUrl || '',
      order: (base as any).order ?? 1,
      active: (base as any).active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (base: OperationalBase) => {
    const idToDelete = base.id || (base as any)._id;
    if (!idToDelete) {
      setErrorMessage('Identificador da base inválido.');
      return;
    }
    if (confirm(`Tem certeza de que deseja excluir a base "${base.name}"?`)) {
      deleteMutation.mutate(idToDelete);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Gestão Operacional</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cards das Bases Operacionais
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edite os endereços, cidades, telefones e canais de WhatsApp de cada base exibida na seção &quot;Onde Estamos&quot; do site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Base Operacional</span>
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

      {/* Grid de Cards das Bases */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Carregando bases...</p>
        </div>
      ) : bases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-sm font-bold text-slate-700">Nenhuma base cadastrada.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
          >
            Cadastrar Primeira Base
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bases.map((base) => {
            const isMatriz = base.id === 'vilhena';
            return (
              <div
                key={base.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all bg-white shadow-sm hover:border-amber-400 ${
                  isMatriz ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                      {base.city} - {base.state}
                    </span>
                    {isMatriz && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        MATRIZ
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
                    {base.name}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{base.address}</span>
                  </p>

                  {base.googleMapsUrl && (
                    <a
                      href={base.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 mb-3"
                    >
                      <span>Ver no Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Telefones de Contato:
                    </span>
                    <div className="flex flex-col gap-1">
                      {base.phones?.map((phone, pIdx) => (
                        <div key={pIdx} className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      WhatsApp:
                    </span>
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>{base.whatsappDisplay || base.whatsappNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(base)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-amber-600" />
                    <span>Editar Base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(base)}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                    title="Excluir Base"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição de Base */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            
            {/* Header do Modal */}
            <div className="p-6 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black">
                  {editingBase ? `Editar Base: ${editingBase.name}` : 'Nova Base Operacional'}
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
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome da Base *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Base Operacional Comodoro"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Ex: Matriz / Apoio"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Comodoro"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    UF *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="RO">RO</option>
                    <option value="MT">MT</option>
                    <option value="AC">AC</option>
                    <option value="AM">AM</option>
                    <option value="MS">MS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Av. Itaúba, 12707, Setor Industrial, Vilhena - RO"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Telefones (Separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.phonesText}
                  onChange={(e) => setFormData({ ...formData, phonesText: e.target.value })}
                  placeholder="Ex: (69) 3321-3942, (69) 3322-1589"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Número (com DDD)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="Ex: 5569999952942"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Exibição
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappDisplay}
                    onChange={(e) => setFormData({ ...formData, whatsappDisplay: e.target.value })}
                    placeholder="Ex: (69) 99995-2942"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Link do Google Maps
                </label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  placeholder="Ex: https://www.google.com/maps/search/?api=1&query=..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Botões do Rodapé */}
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
                    <span>{editingBase ? 'Salvar Base' : 'Criar Base'}</span>
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
