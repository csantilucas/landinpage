'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Truck,
  FileText,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Se não estiver na tela de login e a sessão tiver terminado de carregar sem usuário autenticado
    if (!isPending && !session?.user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [session, isPending, isLoginPage, router]);

  // Não renderiza o layout administrativo na tela de login
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">Carregando painel administrativo...</p>
      </div>
    );
  }

  // Se não autenticado, retorna tela de redirecionamento
  if (!session?.user) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/secoes', label: 'Layout & Seções (Kanban)', icon: Layers },
    { href: '/admin/avisos', label: 'Avisos & Plantões', icon: Bell },
    { href: '/admin/imagens', label: 'Gerenciar Imagens', icon: ImageIcon },
    { href: '/admin/conteudo', label: 'Textos & Conteúdo', icon: FileText },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Header - Estilo Claro Idêntico à Landing Page */}
      <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand com Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-xs">
                TRR
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-slate-900">
                  Painel <span className="text-amber-600">Administrativo</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  TRR Krupinski • Painel de Controle
                </span>
              </div>
            </div>

            {/* Links rápidos */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200 transition-colors font-semibold"
              >
                <span>Ver Site Público</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="text-slate-500 hidden md:block text-xs">
                Conectado como: <strong className="text-slate-800">{session.user.email}</strong>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors font-bold"
                title="Sair do painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>

          </div>

          {/* Abas de Navegação Claras */}
          <nav className="flex space-x-1 sm:space-x-3 border-t border-slate-100 pt-2 pb-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* Conteúdo da Página Administrativa */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
