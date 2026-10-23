import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Award, ShieldCheck, Heart, User } from 'lucide-react';

export default function RetailConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Datos contextuales del consumidor minorista
  const consumer = {
    name: 'Andrea Rodriguez',
    plan: 'PLAN_ORO' as const, // 'PLAN_GRATUITO' | 'PLAN_ORO'
    filipuntos: 450,
    altoqCreditsPen: 25.00,
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Barra de Anuncios y Beneficio Activo */}
      <div className="bg-brand-primary text-white text-xs py-2 px-4 text-center font-medium">
        {consumer.plan === 'PLAN_ORO' ? (
          <span>
            Membresía Oro Activa: Recetas express desbloqueadas, acumulación 2x de Filipuntos y garantía inmediata
          </span>
        ) : (
          <span>
            Plan Gratuito: Pasa al Plan Oro para desbloquear recetas en video y envíos con prioridad comercial
          </span>
        )}
      </div>

      {/* Header Principal del Consumidor Minorista */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo y Enlace */}
          <div className="flex items-center space-x-6">
            <Link href="/app" className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-brand-primary">
                ALTOQ<span className="text-brand-accent">.PE</span>
              </span>
              <span className="hidden md:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary uppercase">
                Consumidor B2C
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 text-sm font-semibold text-brand-text-muted">
              <Link href="/app" className="text-brand-primary hover:text-brand-accent transition-colors">
                Catálogo Liofilizados
              </Link>
              <Link href="/app/recetas" className="hover:text-brand-accent transition-colors">
                Recetas Express (3 min)
              </Link>
              <Link href="/app/pedidos" className="hover:text-brand-accent transition-colors">
                Mis Pedidos
              </Link>
              <Link href="/app/filipuntos" className="hover:text-brand-accent transition-colors flex items-center space-x-1">
                <Award className="w-4 h-4 text-brand-accent" />
                <span>Filipuntos</span>
              </Link>
            </nav>
          </div>

          {/* Widgets de Billetera y Usuario */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Saldo de Filipuntos */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-900">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{consumer.filipuntos} Filipuntos</span>
            </div>

            {/* Saldo de Altoq Créditos */}
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>S/ {consumer.altoqCreditsPen.toFixed(2)} Créditos</span>
            </div>

            {/* Carrito de Compras */}
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-brand-surface-soft text-brand-primary transition-colors"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            {/* Perfil de Usuario */}
            <div className="flex items-center space-x-2 pl-2 border-l border-brand-primary/10">
              <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary-dark font-bold text-sm">
                AR
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-brand-primary">
                {consumer.plan === 'PLAN_ORO' ? 'Membresía Oro' : 'Plan Gratuito'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal de la Plantilla Minorista */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer Minorista con Garantía Sanitaria y Logística de Lima */}
      <footer className="bg-white border-t border-brand-primary/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center text-xs text-brand-text-muted">
          <p>
            ALTOQ PE &copy; 2026. Alimentos Liofilizados 100% peruanos con Registro Sanitario DIGESA y empaque hermético tricapa.
          </p>
          <div className="mt-2 sm:mt-0 flex justify-center space-x-4">
            <Link href="/app/garantia" className="hover:text-brand-primary font-semibold">
              Garantía de Devolución
            </Link>
            <Link href="/app/seguridad-humedad" className="hover:text-brand-primary font-semibold">
              Protección Humedad Lima (&gt;80% HR)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
