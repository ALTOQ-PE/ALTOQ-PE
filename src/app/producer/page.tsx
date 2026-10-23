'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/components/marketplace/MarketplaceContext';
import {
  Package,
  TrendingUp,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Video,
  UploadCloud,
  Truck,
  ExternalLink,
  Warehouse
} from 'lucide-react';

export default function ProducerDashboardPage() {
  const { approvedProducts, currentUser } = useMarketplace();

  // Filtrar productos del productor actual o mostrar los productos asociados
  const producerProducts = approvedProducts.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.companyName && p.producerName.toLowerCase().includes(currentUser.companyName.toLowerCase().slice(0, 10))) {
      return true;
    }
    // Si es el usuario de prueba proveedor@gmail.com, incluir los productos de Valle Sagrado y andinos
    if (currentUser.email === 'proveedor@gmail.com') {
      return true;
    }
    return p.producerId === currentUser.id;
  });

  // Cálculo de stock total en Lima
  const totalStockInLima = producerProducts.reduce((acc, curr) => acc + (curr.stockInLima || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. KPIs del Productor Agroindustrial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Ventas del Mes</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-brand-primary mt-2">
            S/ 7,320.00
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +18% comparado al mes anterior
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Stock en Acopio Lima</span>
            <Warehouse className="w-4 h-4 text-brand-secondary" />
          </div>
          <div className="text-2xl font-black text-brand-primary mt-2">
            {totalStockInLima} unidades
          </div>
          <div className="text-[11px] text-brand-text-muted mt-1">
            Custodia con control de humedad &lt; 45% HR
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Liquidación Próxima</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="text-2xl font-black text-brand-accent mt-2">
            S/ 4,250.00
          </div>
          <div className="text-[11px] text-brand-text-muted mt-1">
            Pago programado: 31 de Octubre (Quincenal)
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Cotizaciones B2B</span>
            <MessageSquare className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-2xl font-black text-brand-primary mt-2">
            3 recibidas
          </div>
          <div className="text-[11px] text-brand-secondary-dark font-bold mt-1">
            De HORECA y tiendas especializadas
          </div>
        </div>
      </div>

      {/* 2. Listado de Productos y Estado Sanitario */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-brand-primary">
              Mis Productos Liofilizados en Catálogo
            </h2>
            <p className="text-xs text-brand-text-muted">
              {currentUser?.producerPlan === 'PLAN_ORO' ? 'Membresía Plan Oro Activa: Publicación ilimitada y promoción destacada.' : 'Plan Plata: Publicaciones activas.'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/producer/acopio-lima"
              className="px-3.5 py-2 border border-gray-300 rounded-brand-md text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver Acopio Lima
            </Link>
            <Link
              href="/producer/nuevo-producto"
              className="px-4 py-2 bg-brand-primary text-white rounded-brand-md text-xs font-bold hover:bg-brand-primary-light transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ Registrar Nuevo Alimento</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-brand-text-muted uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Producto Liofilizado</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Código DIGESA</th>
                <th className="py-3 px-4">Octógonos</th>
                <th className="py-3 px-4">Costo Productor</th>
                <th className="py-3 px-4">Precio Público</th>
                <th className="py-3 px-4">Stock en Lima</th>
                <th className="py-3 px-4">Estado Sanitario</th>
                <th className="py-3 px-4 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {producerProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    Aún no tienes productos registrados. Haz clic en "+ Registrar Nuevo Alimento" para subir tu primer producto.
                  </td>
                </tr>
              ) : (
                producerProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-brand-bg/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-brand-primary text-sm">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.packagingPhotoUrl}
                          alt={prod.commercialName}
                          className="w-10 h-10 object-contain rounded bg-white p-1 border border-gray-200"
                        />
                        <div>
                          <Link href={`/producto/${prod.id}`} className="hover:text-brand-secondary transition-colors block">
                            {prod.commercialName}
                          </Link>
                          <span className="text-[10px] text-gray-400 font-normal">
                            Rinde {prod.rehydratedYieldGrams}g en plato
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-brand-text-muted">
                      {prod.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-gray-700">
                      {prod.digesaCode}
                    </td>
                    <td className="py-4 px-4">
                      {prod.octagonCount === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          0 Octógonos
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-white">
                          {prod.octagonCount} {prod.octagonCount === 1 ? 'Octógono' : 'Octógonos'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-brand-primary">
                      S/ {prod.wholesaleCostPen.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      S/ {prod.publicPricePen.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-800">
                      {prod.stockInLima} u.
                    </td>
                    <td className="py-4 px-4">
                      {prod.healthPolicyAccepted ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Aprobado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>En Revisión Técnica</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Link
                        href="/producer/acopio-lima"
                        className="px-2.5 py-1 rounded border border-gray-300 hover:border-brand-primary text-brand-primary font-bold text-[11px] inline-flex items-center space-x-1"
                      >
                        <Truck className="w-3 h-3 text-brand-secondary" />
                        <span>Enviar Lote</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recursos de Desalfabetización Digital y Agrocomunidades (Plan Oro) */}
      <section className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary-dark">
              Programa de Desalfabetización Digital
            </span>
            <h3 className="text-lg font-extrabold text-brand-primary">
              Guías Prácticas y Agrocomunidades para Productores
            </h3>
          </div>
          <Link
            href="/producer/agrocomunidades"
            className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center space-x-1"
          >
            <span>Ver todos los cursos y comunidad</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Link
            href="/producer/agrocomunidades"
            className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2 hover:border-brand-primary/30 transition-all block group"
          >
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs group-hover:text-brand-secondary transition-colors">
              <Video className="w-4 h-4 text-brand-accent" />
              <span>De Foto Simple a Fotografía Profesional</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Aprende a fotografiar tus pouches y platos liofilizados con luz natural de tu taller agroindustrial.
            </p>
          </Link>

          <Link
            href="/producer/agrocomunidades"
            className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2 hover:border-brand-primary/30 transition-all block group"
          >
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs group-hover:text-brand-secondary transition-colors">
              <Video className="w-4 h-4 text-brand-accent" />
              <span>Diseña Publicaciones de Alto Impacto en Canva</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Plantillas oficiales listas para promocionar tus productos en redes sociales y ferias locales.
            </p>
          </Link>

          <Link
            href="/producer/agrocomunidades"
            className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2 hover:border-brand-primary/30 transition-all block group"
          >
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs group-hover:text-brand-secondary transition-colors">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Taller de Buenas Prácticas y Registro DIGESA</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Guía paso a paso para trámites sanitarios, renovación y controles bromatológicos en Perú.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
