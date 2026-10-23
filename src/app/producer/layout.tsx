'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MarketplaceProvider, useMarketplace } from '@/components/marketplace/MarketplaceContext';
import { AltoqLogo } from '@/components/ui/AltoqLogo';
import {
  Package,
  Warehouse,
  FileText,
  DollarSign,
  Users,
  UploadCloud,
  MapPin,
  Store,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

function ProducerHeaderContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useMarketplace();

  const producerName = currentUser?.companyName || 'Cooperativa Valle Sagrado';
  const producerRegion = currentUser?.originRegion || 'Cusco';
  const isGoldPlan = currentUser?.producerPlan !== 'PLAN_PLATA';

  const navItems = [
    { label: 'Mis Productos', href: '/producer', icon: Package },
    { label: 'Inventario Consignado Lima', href: '/producer/acopio-lima', icon: Warehouse },
    { label: 'Cotizaciones B2B', href: '/producer/cotizaciones-recibidas', icon: FileText },
    { label: 'Liquidaciones Bancarias', href: '/producer/liquidaciones', icon: DollarSign },
    { label: 'Agrocomunidades', href: '/producer/agrocomunidades', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6]">
      {/* Barra de Notificación Institucional para Proveedores */}
      <div className="bg-[#0A291F] text-emerald-100 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/40">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Panel Agroindustrial ALTOQ PE • Despacho Centralizado en Acopio Seco Lima (&lt; 45% HR)
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-white transition-colors flex items-center space-x-1">
            <Store className="w-3.5 h-3.5" />
            <span>Ver Marketplace</span>
          </Link>
          <span className="text-emerald-700">|</span>
          <Link href="/perfil" className="hover:text-white transition-colors flex items-center space-x-1">
            <User className="w-3.5 h-3.5" />
            <span>Mi Perfil de Proveedor</span>
          </Link>
        </div>
      </div>

      {/* Header Principal del Panel Proveedor */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <Link href="/producer" className="flex items-center space-x-2.5 transition-opacity hover:opacity-90" aria-label="ALTOQ PE - Panel Proveedor">
              <AltoqLogo width={155} height={38} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                Panel Proveedor
              </span>
            </Link>

            {/* Menú de Navegación del Panel */}
            <nav className="hidden lg:flex space-x-1 text-xs font-bold text-brand-text-muted">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-brand-md transition-colors flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'hover:text-brand-primary hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Empresa y Plan del Proveedor */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-brand-primary flex items-center justify-end space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                <span className="truncate max-w-[180px]">{producerName} ({producerRegion})</span>
              </div>
              <div className="text-[11px] font-semibold text-brand-text-muted">
                {isGoldPlan ? (
                  <span className="text-brand-accent font-bold">Membresía Plan Oro ($15/mes)</span>
                ) : (
                  <span>Plan Plata ($7/mes - 3 productos máx.)</span>
                )}
              </div>
            </div>

            {/* Botón Acción Principal: Publicar Producto */}
            <Link
              href="/producer/nuevo-producto"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-brand-md bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-light transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publicar Producto</span>
            </Link>
          </div>
        </div>

        {/* Sub-barra de Navegación Móvil */}
        <div className="lg:hidden border-t border-gray-100 px-4 py-2 overflow-x-auto flex space-x-2 scrollbar-none bg-gray-50/70 text-xs font-bold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:text-brand-primary bg-white border border-gray-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
            <Link href="/producer/acopio-lima" className="hover:text-brand-primary font-semibold">
              Custodia en Acopio Lima
            </Link>
            <Link href="/producer/liquidaciones" className="hover:text-brand-primary font-semibold">
              Estados de Pago Quincenal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketplaceProvider>
      <ProducerHeaderContent>{children}</ProducerHeaderContent>
    </MarketplaceProvider>
  );
}
