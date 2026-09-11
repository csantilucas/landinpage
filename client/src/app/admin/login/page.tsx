'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { signIn, useSession } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Se o usuário já estiver autenticado, redireciona diretamente ao painel
  useEffect(() => {
    if (!sessionLoading && session?.user) {
      window.location.replace('/admin');
    }
  }, [session, sessionLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim(),
        password: password,
      });

      if (res.error) {
        if ((res.error as any).status === 429) {
          setError(res.error.message || 'Muitas tentativas de login a partir deste IP. Por segurança, aguarde 15 minutos antes de tentar novamente.');
        } else {
          setError(res.error.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
        }
      } else {
        // Redirecionamento completo do navegador para persistência segura de cookies cross-site
        // e prevenção de condição de corrida com o cache de sessão do client
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err?.message || 'Falha ao conectar com o servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header com identidade da TRR Krupinski */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Painel <span className="text-amber-500">Administrativo</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            TRR Krupinski • Acesso Restrito
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-amber-600 transition-colors"
            >
              ← Voltar ao site institucional
            </a>
          </div>
        </form>

      </div>
    </div>
  );
}
