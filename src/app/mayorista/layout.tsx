import React from 'react';
import Link from 'next/link';
import { Building2, FileText, ShoppingCart, HelpCircle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function WholesaleConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wholesaleProfile = {
    companyName: 'Operadora Gastronómica Peruana S.A.C.',
    ruc: '20608912341',
    isVerified: true,
    plan: 'PLAN_ORO' as const, // 'PLAN_GRATUITO' | 'PLAN_ORO'
    pendingQuotesCount: 2,
    dedicatedAdvisor: 'Carlos Mendívil (Asesor B2B)',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F4]">
      {/* Barra de Notificación B2B */}
      <div className="bg-[#0A291F] text-emerald-100 text-xs py-2 px-4 text-center font-medium border-b border-emerald-800/40">
        Portal Mayorista B2B • Precios Ex-Planta Escalonados por Volumen y Facturación con RUC
      </div>

      {/* Header Corporativo Mayorista */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-primary/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/mayorista" className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-brand-primary">
                ALTOQ<span className="text-brand-secondary">.B2B</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-secondary/15 text-brand-secondary-dark uppercase tracking-wide">
                HORECA / Retail
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 text-sm font-semibold text-brand-text-muted">
              <Link href="/mayorista" className="text-brand-primary hover:text-brand-secondary-dark transition-colors">
                Catálogo por Cajas y Lotes
              </Link>
              <Link href="/mayorista/cotizaciones" className="hover:text-brand-secondary-dark transition-colors flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-brand-secondary" />
                <span>Mis Cotizaciones ({wholesaleProfile.pendingQuotesCount})</span>
              </Link>
              <Link href="/mayorista/fichas-tecnicas" className="hover:text-brand-secondary-dark transition-colors">
                Auditoría DIGESA / HACCP
              </Link>
              <Link href="/mayorista/pedidos" className="hover:text-brand-secondary-dark transition-colors">
                Órdenes Corporativas
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Asesor Dedicado */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-900">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{wholesaleProfile.dedicatedAdvisor}</span>
            </div>

            {/* Datos de Empresa */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-brand-primary flex items-center justify-end space-x-1">
                <Building2 className="w-3.5 h-3.5 text-brand-secondary" />
                <span>{wholesaleProfile.companyName}</span>
              </div>
              <div className="text-[11px] font-mono text-brand-text-muted">
                RUC: {wholesaleProfile.ruc} • {wholesaleProfile.plan === 'PLAN_ORO' ? 'Oro B2B' : 'Gratuito'}
              </div>
            </div>

            {/* Carrito B2B por Volumen */}
            <button
              type="button"
              className="relative p-2 rounded-lg bg-brand-surface-soft hover:bg-gray-200 text-brand-primary transition-colors"
              aria-label="Carrito de compras B2B"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-secondary-dark text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                12
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal Mayorista */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer B2B */}
      <footer className="bg-white border-t border-brand-primary/10 py-6 mt-12 text-xs text-brand-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            ALTOQ PE División B2B • Centro de Acopio Seco y Despacho Consolidado en Lima. Facturación Electrónica SUNAT.
          </p>
          <div className="flex space-x-4">
            <Link href="/mayorista/terminos" className="hover:text-brand-primary font-semibold">
              Condiciones de Despacho y Flete
            </Link>
            <Link href="/mayorista/soporte" className="hover:text-brand-primary font-semibold">
              Mesa de Ayuda B2B
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
