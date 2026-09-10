'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function AdminGearButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside aria-label="Painel Administrativo" className="fixed bottom-6 left-6 z-40">
      <Link
        href="/admin"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-700 hover:text-amber-600 hover:border-amber-400 border border-slate-200 shadow-md shadow-slate-900/10 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Acessar Painel Administrativo"
      >
        <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90 text-amber-600" />

        {/* Tooltip */}
        <span
          className={`absolute left-14 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold whitespace-nowrap shadow-lg border border-slate-200 pointer-events-none transition-all duration-200 ${
            isHovered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-2'
          }`}
        >
          Painel Administrativo
        </span>
      </Link>
    </aside>
  );
}
