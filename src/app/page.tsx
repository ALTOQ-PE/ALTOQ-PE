'use client';

import React from 'react';
import { MarketplaceProvider, useMarketplace } from '@/components/marketplace/MarketplaceContext';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { MarketplaceSidebar } from '@/components/marketplace/MarketplaceSidebar';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { OrdersModal } from '@/components/marketplace/OrdersModal';
import { QuoteModal } from '@/components/marketplace/QuoteModal';
import { ProducerProductModal } from '@/components/marketplace/ProducerProductModal';
import { ShieldCheck, Sparkles, Filter, ChevronDown, CheckCircle2 } from 'lucide-react';

function MarketplaceContent() {
  const {
    approvedProducts,
    currentRole,
    searchQuery,
    selectedCategory,
    selectedOctagons,
    selectedRegion,
  } = useMarketplace();

  // Filtrado de productos en tiempo real
  const filteredProducts = approvedProducts.filter((product) => {
    // 1. Filtro por búsqueda
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.commercialName.toLowerCase().includes(q);
      const matchIngredients = product.ingredients.toLowerCase().includes(q);
      const matchProducer = product.producerName.toLowerCase().includes(q);
      if (!matchName && !matchIngredients && !matchProducer) return false;
    }

    // 2. Filtro por categoría
    if (selectedCategory !== 'TODAS' && product.category !== selectedCategory) {
      return false;
    }

    // 3. Filtro por octógonos
    if (selectedOctagons !== null && product.octagonCount > selectedOctagons) {
      return false;
    }

    // 4. Filtro por región
    if (selectedRegion !== 'TODAS' && product.originRegion !== selectedRegion) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      {/* 1. Header Oficial Tipo Saga Falabella */}
      <MarketplaceNavbar />

      {/* 2. Hero Banners Promocionales */}
      <MarketplaceHero />

      {/* 3. Contenedor Principal: Filtros a la Izquierda y Catálogo Central */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar de Filtros */}
          <MarketplaceSidebar />

          {/* Catálogo de Productos */}
          <section className="flex-1 w-full space-y-4">
            {/* Barra de Conteo y Ordenamiento */}
            <div className="bg-white border border-brand-primary/10 rounded-brand-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="text-xs text-brand-text-muted">
                Mostrando <strong className="text-brand-primary">{filteredProducts.length}</strong> alimentos liofilizados disponibles para despacho en Lima
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400">Ordenar por:</span>
                <select className="border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-brand-primary bg-white focus:outline-none focus:border-brand-primary">
                  <option>Recomendados ALTOQ</option>
                  <option>0 Octógonos primero</option>
                  <option>Menor precio</option>
                  <option>Mayor rendimiento rehidratado</option>
                </select>
              </div>
            </div>

            {/* Cuadrícula de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-12 text-center space-y-3">
                <p className="text-sm font-bold text-brand-text-muted">
                  No se encontraron alimentos con los filtros seleccionados
                </p>
                <p className="text-xs text-gray-400">
                  Prueba cambiando los filtros de octógonos o borrando el texto de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <MarketplaceProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 4. Carrito Deslizable y Modales Operativos Reales */}
      <CartDrawer />
      <OrdersModal />
      <QuoteModal />
      <ProducerProductModal />

      {/* 5. Footer del Marketplace */}
      <footer className="bg-white border-t border-brand-primary/10 mt-16 py-8 text-xs text-brand-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div>
              <span className="font-extrabold text-lg tracking-tight text-brand-primary">
                ALTOQ<span className="text-brand-accent">.PE</span>
              </span>
              <span className="block text-[8px] font-extrabold uppercase tracking-[0.25em] text-brand-secondary-dark">
                FOOD TECHNOLOGY
              </span>
              <span className="block text-[11px] font-bold text-gray-700 mt-1">
                RUC: 20711653786
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              El marketplace líder en alimentos liofilizados e instantáneos del Perú. Conectamos directamente a agroindustrias regionales con consumidores y comercios.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-brand-primary uppercase text-[11px] tracking-wider">
              Garantía Sanitaria
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              100% de productos con Registro Sanitario DIGESA al día y límite estricto de máximo 2 octógonos (Ley 30021).
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-brand-primary uppercase text-[11px] tracking-wider">
              Logística Lima (&gt;80% HR)
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Centro de acopio seco centralizado en Lima con control estricto de humedad y empaque alveolar rígido anti-impacto.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-brand-primary uppercase text-[11px] tracking-wider">
              Canales y Soporte
            </h4>
            <div className="text-[11px] space-y-1 text-gray-500">
              <div>Ventas B2B: comercial@altoq.pe</div>
              <div>Mesa de Ayuda WhatsApp Lima</div>
              <div>Horario: Lun - Sáb: 8:00 am - 7:00 pm</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
          ALTOQ PE &copy; 2026 • Plataforma E-commerce y PWA FoodTech. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
