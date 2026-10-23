import React from 'react';
import Link from 'next/link';
import { Package, TrendingUp, DollarSign, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2, Video } from 'lucide-react';

interface ProducerProductItem {
  id: string;
  name: string;
  category: string;
  digesaCode: string;
  octagons: number;
  stockInLima: number;
  wholesaleCostPen: number;
  publicPricePen: number;
  status: 'APROBADO' | 'EN_REVISION';
}

const PRODUCER_PRODUCTS: ProducerProductItem[] = [
  {
    id: 'prod-001',
    name: 'Ají de Gallina Liofilizado Tradicional (45g)',
    category: 'Plato Típico',
    digesaCode: 'RSA-P2409821-LIMA',
    octagons: 1,
    stockInLima: 48,
    wholesaleCostPen: 12.00,
    publicPricePen: 22.50,
    status: 'APROBADO',
  },
  {
    id: 'prod-004',
    name: 'Carapulcra con Panceta Liofilizada (55g)',
    category: 'Plato Típico',
    digesaCode: 'RSA-C9928120-CUSCO',
    octagons: 2, // Límite legal permitido
    stockInLima: 30,
    wholesaleCostPen: 14.00,
    publicPricePen: 24.90,
    status: 'APROBADO',
  },
  {
    id: 'prod-005',
    name: 'Crema Concentrada de Tarwi Andino (40g)',
    category: 'Sopa Instantánea',
    digesaCode: 'RSA-T8102931-DIGESA',
    octagons: 0,
    stockInLima: 0,
    wholesaleCostPen: 9.50,
    publicPricePen: 18.00,
    status: 'EN_REVISION',
  },
];

export default function ProducerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* 1. KPIs del Productor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Ventas del Mes</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-brand-primary mt-2">
            S/ 7,320.00
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +18% comparado al mes anterior
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Stock en Acopio Lima</span>
            <Package className="w-4 h-4 text-brand-secondary" />
          </div>
          <div className="text-2xl font-extrabold text-brand-primary mt-2">
            78 unidades
          </div>
          <div className="text-[11px] text-brand-text-muted mt-1">
            Custodia con control de humedad &lt; 50% HR
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-text-muted text-xs font-bold uppercase">
            <span>Liquidación Próxima</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="text-2xl font-extrabold text-brand-accent mt-2">
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
          <div className="text-2xl font-extrabold text-brand-primary mt-2">
            4 recibidas
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
              Plan Oro Activo: Publicación ilimitada y promoción destacada en Lima.
            </p>
          </div>
          <Link
            href="/producer/nuevo-producto"
            className="px-4 py-2 bg-brand-primary text-white rounded-brand-md text-xs font-bold hover:bg-brand-primary-light transition-colors self-start sm:self-auto"
          >
            + Registrar Nuevo Alimento
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-brand-text-muted uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Código DIGESA</th>
                <th className="py-3 px-4">Octógonos</th>
                <th className="py-3 px-4">Costo Productor (Ex-Planta)</th>
                <th className="py-3 px-4">Stock en Lima</th>
                <th className="py-3 px-4">Estado Sanitario</th>
                <th className="py-3 px-4 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRODUCER_PRODUCTS.map((prod) => (
                <tr key={prod.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-brand-primary text-sm">
                    {prod.name}
                  </td>
                  <td className="py-4 px-4 font-medium text-brand-text-muted">
                    {prod.category}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-gray-700">
                    {prod.digesaCode}
                  </td>
                  <td className="py-4 px-4">
                    {prod.octagons === 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        0 Octógonos
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {prod.octagons} {prod.octagons === 1 ? 'Octógono' : 'Octógonos'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-brand-primary">
                    S/ {prod.wholesaleCostPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-800">
                    {prod.stockInLima} u.
                  </td>
                  <td className="py-4 px-4">
                    {prod.status === 'APROBADO' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Aprobado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        <AlertTriangle className="w-3 h-3" />
                        <span>En Revisión Técnica</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded border border-gray-300 hover:border-brand-primary text-brand-primary font-semibold text-[11px]"
                    >
                      Enviar Lote a Lima
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recursos de Desalfabetización Digital y Agrocomunidades (Plan Oro) */}
      <section className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary-dark">
              Programa de Desalfabetización Digital
            </span>
            <h3 className="text-lg font-extrabold text-brand-primary">
              Guías Prácticas y Agrocomunidades para Productores
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
            Acceso Oro Habilitado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2">
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs">
              <Video className="w-4 h-4 text-brand-accent" />
              <span>De Foto Simple a Fotografía Profesional</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Aprende a fotografiar tus pouches y platos liofilizados con luz natural de tu taller agroindustrial.
            </p>
          </div>

          <div className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2">
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs">
              <Video className="w-4 h-4 text-brand-accent" />
              <span>Diseña Publicaciones de Alto Impacto en Canva</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Plantillas oficiales listas para promocionar tus productos en redes sociales y ferias locales.
            </p>
          </div>

          <div className="p-4 rounded-brand-md bg-brand-bg/50 border border-brand-primary/10 space-y-2">
            <div className="flex items-center space-x-2 text-brand-primary font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Taller de Buenas Prácticas y Registro DIGESA</span>
            </div>
            <p className="text-[11px] text-brand-text-muted">
              Guía paso a paso para trámites sanitarios, renovación y controles bromatológicos en Perú.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
