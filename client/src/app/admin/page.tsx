'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  FileText,
  ArrowRight,
  Plus,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const { data: noticesData, isLoading: noticesLoading } = useQuery({
    queryKey: ['adminNotices'],
    queryFn: adminApi.getNotices,
  });

  const { data: fleetData, isLoading: fleetLoading } = useQuery({
    queryKey: ['adminFleet'],
    queryFn: adminApi.getFleet,
  });

  const loading = noticesLoading || fleetLoading;
  const notices = noticesData?.data || [];
  const fleet = fleetData?.data || [];

  const stats = {
    noticesCount: notices.length,
    activeNoticesCount: notices.filter((n: any) => n.active).length,
    fleetCount: fleet.length,
    activeFleetCount: fleet.filter((f: any) => f.active).length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-vindas Limpo */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Painel Ativo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Painel de Controle • TRR Krupinski
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie comunicados, fotos da frota, textos institucionais e o layout da página inicial.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/avisos"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Aviso</span>
          </Link>
          <Link
            href="/admin/imagens"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Fotos</span>
          </Link>
        </div>
      </div>

      {/* Grid de Seções de Gerenciamento - Direto e sem textos desnecessários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* 1. Quadro de Avisos & Notícias */}
        <Link
          href="/admin/avisos"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Quadro de Avisos & Notícias
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Publique comunicados e notícias com fotos em destaque e botões de ação na página inicial.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Avisos ativos no site:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              {loading ? '...' : `${stats.activeNoticesCount} de ${stats.noticesCount}`}
            </span>
          </div>
        </Link>

        {/* 2. Fotos do Site */}
        <Link
          href="/admin/imagens"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Fotos do Site
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie as fotos da frota de caminhões, banner inicial, colheita e seções institucionais.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Fotos cadastradas:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              {loading ? '...' : `${stats.activeFleetCount} ativas`}
            </span>
          </div>
        </Link>

        {/* 3. Textos do Site */}
        <Link
          href="/admin/conteudo"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Textos & Informações
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Atualize títulos, história da empresa, números de confiança, produtos e telefones de atendimento.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Seções editáveis:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              Hero, Sobre, Serviços, Contato
            </span>
          </div>
        </Link>

        {/* 4. Ordem das Seções */}
        <Link
          href="/admin/secoes"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Ordem das Seções
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Alterne a ordem vertical de exibição dos blocos da página principal ou oculte seções específicas.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Disposição da página:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              Personalizável
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}
