'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  Truck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
  Image as ImageIcon,
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
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sistema Operacional & Autenticado</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Painel de Controle • TRR Krupinski
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie avisos de safra, links das fotos da frota e textos institucionais da landing page.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/avisos"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Novo Aviso</span>
          </Link>
          <Link
            href="/admin/imagens"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>Gerenciar Imagens</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card Avisos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <Link
              href="/admin/avisos"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.activeNoticesCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Avisos Ativos no Site ({stats.noticesCount} total)
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Mensagens de plantão, avisos de safra e comunicados exibidos no topo do site.
          </p>
        </div>

        {/* Card Imagens do Site */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <Link
              href="/admin/imagens"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.activeFleetCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Imagens Ativas do Site ({stats.fleetCount} cadastradas)
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Fotos do carrossel da frota, banner hero, seção sobre e cards da página.
          </p>
        </div>

        {/* Card Textos / Conteúdo */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <Link
              href="/admin/conteudo"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Editar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="text-3xl font-black text-slate-900">
            100%
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Textos Institucionais & Produtos
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Edição de títulos, história, contadores de confiança e produtos/serviços.
          </p>
        </div>

        {/* Card Layout & Seções */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/50 transition-all sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <Link
              href="/admin/secoes"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Organizar Seções</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-lg font-black text-slate-900">
                Disposição de Seções (Kanban Vertical)
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Alterne a posição de exibição vertical do Hero, Avisos, Frota, Serviços, Bases e Contato com arrastar e soltar ou botões de subir/descer.
              </p>
            </div>
            <Link
              href="/admin/secoes"
              className="px-4 py-2 bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 text-center"
            >
              Acessar Kanban de Layout →
            </Link>
          </div>
        </div>

      </div>

      {/* Informações Técnicas da Arquitetura - Estilo Claro */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" />
          <span>Estrutura & Segurança</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Arquitetura em Camadas com Better Auth & MongoDB
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <strong className="block text-slate-900 mb-1">Routes & Middlewares</strong>
            Endpoints protegidos por sessão criptografada e verificação de privilégio administrativo.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <strong className="block text-slate-900 mb-1">Services & Repositories</strong>
            Regras de negócio isoladas com persistência desacoplada em coleções MongoDB.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <strong className="block text-slate-900 mb-1">Armazenamento de Fotos</strong>
            Registro de links diretos de imagens (URLs públicas), garantindo velocidade e leveza.
          </div>
        </div>
      </div>
    </div>
  );
}
