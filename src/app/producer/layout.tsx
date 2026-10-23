import React from 'react';
import Link from 'next/link';
import { Package, BarChart3, UploadCloud, Users, CreditCard, Sparkles, MapPin } from 'lucide-react';

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const producer = {
    companyName: 'Agroindustrias del Valle Sagrado',
    originRegion: 'Cusco',
    plan: 'PLAN_ORO' as const, // 'PLAN_PLATA' | 'PLAN_ORO'
    publishedProducts: 4,
    maxProductsAllowed: 'Ilimitado',
    pendingSettlementPen: 4250.00,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6]">
      {/* Header del Productor Agroindustrial */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/producer" className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-brand-primary">
                ALTOQ<span className="text-brand-accent">.PRO</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase">
                Panel Proveedor
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 text-sm font-semibold text-brand-text-muted">
              <Link href="/producer" className="text-brand-primary hover:text-brand-accent transition-colors">
                Mis Productos
              </Link>
              <Link href="/producer/acopio-lima" className="hover:text-brand-accent transition-colors">
                Inventario Consignado Lima
              </Link>
              <Link href="/producer/cotizaciones-recibidas" className="hover:text-brand-accent transition-colors">
                Cotizaciones B2B
              </Link>
              <Link href="/producer/liquidaciones" className="hover:text-brand-accent transition-colors">
                Liquidaciones Bancarias
              </Link>
              <Link href="/producer/agrocomunidades" className="hover:text-brand-accent transition-colors flex items-center space-x-1">
                <Users className="w-4 h-4 text-brand-secondary" />
                <span>Agrocomunidades</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Ubicación y Plan */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-brand-primary flex items-center justify-end space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                <span>{producer.companyName} ({producer.originRegion})</span>
              </div>
              <div className="text-[11px] font-semibold text-brand-text-muted">
                {producer.plan === 'PLAN_ORO' ? (
                  <span className="text-brand-accent font-bold">Membresía Plan Oro ($15/mes)</span>
                ) : (
                  <span>Plan Plata ($7/mes - 3 productos máx.)</span>
                )}
              </div>
            </div>

            {/* Botón de Carga Rápida */}
            <Link
              href="/producer/nuevo-producto"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-brand-md bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-light transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publicar Producto</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal Proveedor */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer Proveedor */}
      <footer className="bg-white border-t border-brand-primary/10 py-6 mt-12 text-xs text-brand-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            Centro de Operaciones y Acopio Seco en Lima • Liquidaciones Financieras Quincenales garantizadas.
          </p>
          <div className="flex space-x-4">
            <Link href="/producer/guia-empaques" className="hover:text-brand-primary font-semibold">
              Especificaciones de Empaque Tricapa
            </Link>
            <Link href="/producer/soporte-digesa" className="hover:text-brand-primary font-semibold">
              Asistencia Técnica DIGESA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
