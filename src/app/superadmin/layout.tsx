import React from 'react';
import Link from 'next/link';
import { AltoqLogo } from '@/components/ui/AltoqLogo';
import { ShieldAlert, Activity, CheckSquare, Layers, LineChart, Banknote, Warehouse } from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1E17] text-gray-100">
      {/* Barra de Estado Operativo y Humedad en Acopio Lima */}
      <div className="bg-[#07130F] border-b border-emerald-900/50 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Sistema Zero-Sleep: Activo (PostgreSQL OK)</span>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">
            Humedad Exterior Lima: <strong className="text-amber-400">84% HR</strong>
          </span>
          <span className="text-gray-300">
            Cámara Acopio Seco: <strong className="text-emerald-400">42% HR (Seguro)</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-gray-400">
          <span>SuperAdmin: <strong>Master Control</strong></span>
          <span className="text-gray-500">|</span>
          <Link href="/app" className="text-emerald-400 hover:underline">
            Ver Tienda Minorista
          </Link>
          <Link href="/mayorista" className="text-emerald-400 hover:underline">
            Ver Portal B2B
          </Link>
        </div>
      </div>

      {/* Header Principal SuperAdmin */}
      <header className="sticky top-0 z-40 bg-[#0E241C] border-b border-emerald-800/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 transition-opacity hover:opacity-90">
              <AltoqLogo variant="light" width={155} height={38} />
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                Gobernanza
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 text-sm font-semibold text-gray-300">
              <Link href="/superadmin" className="text-emerald-400 hover:text-white transition-colors">
                Curaduría Sanitaria (DIGESA)
              </Link>
              <Link href="/superadmin/vouchers" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Validar Vouchers (2)</span>
              </Link>
              <Link href="/superadmin/acopio-seco" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                <Warehouse className="w-4 h-4 text-brand-secondary" />
                <span>Acopio Seco Lima</span>
              </Link>
              <Link href="/superadmin/unit-economics" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                <LineChart className="w-4 h-4 text-amber-400" />
                <span>Unit Economics (MCu)</span>
              </Link>
              <Link href="/superadmin/liquidaciones" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>Liquidaciones</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-300">
              Rol: SUPERADMIN
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal SuperAdmin */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer SuperAdmin */}
      <footer className="bg-[#07130F] border-t border-emerald-900/40 py-6 text-xs text-gray-500 text-center">
        ALTOQ PE Control Central • Auditoría de Seguridad, Registro Sanitario DIGESA y Margen de Contribución Unitario.
      </footer>
    </div>
  );
}
