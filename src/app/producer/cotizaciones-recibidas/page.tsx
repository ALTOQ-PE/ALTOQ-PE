'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  Send,
  Download,
  AlertCircle,
  Package,
  Calendar,
  MapPin
} from 'lucide-react';

interface ProducerQuote {
  id: string;
  quoteCode: string;
  clientCompany: string;
  clientRuc: string;
  contactPerson: string;
  productName: string;
  boxesCount: number;
  unitsPerBox: number;
  totalUnits: number;
  unitPricePen: number;
  totalPen: number;
  deliveryDestination: string;
  requestedDate: string;
  paymentTerms: string;
  status: 'PENDIENTE' | 'ACEPTADA_ALISTAMIENTO' | 'DESPACHADA';
}

const INITIAL_QUOTES: ProducerQuote[] = [
  {
    id: 'q-001',
    quoteCode: 'COT-B2B-2026-104',
    clientCompany: 'Operadora Gastronómica Peruana S.A.C.',
    clientRuc: '20608912341',
    contactPerson: 'Carlos Mendívil (Gerente de Compras HORECA)',
    productName: 'Ají de Gallina Liofilizado Tradicional (45g)',
    boxesCount: 5,
    unitsPerBox: 24,
    totalUnits: 120,
    unitPricePen: 16.50,
    totalPen: 1980.00,
    deliveryDestination: 'Av. Conquistadores 450, San Isidro, Lima',
    requestedDate: '28 de Octubre, 2026',
    paymentTerms: 'Contado con Factura Electrónica B2B',
    status: 'PENDIENTE',
  },
  {
    id: 'q-002',
    quoteCode: 'COT-B2B-2026-102',
    clientCompany: 'Distribuidora Andina Gourmet S.A.C.',
    clientRuc: '20519284102',
    contactPerson: 'Elena Morales (Jefa de Abastecimiento)',
    productName: 'Carapulcra con Panceta Liofilizada (55g)',
    boxesCount: 8,
    unitsPerBox: 24,
    totalUnits: 192,
    unitPricePen: 17.50,
    totalPen: 3360.00,
    deliveryDestination: 'Av. Argentina 2850, Cercado de Lima',
    requestedDate: '26 de Octubre, 2026',
    paymentTerms: 'Crédito Comercial 15 días (Garantizado)',
    status: 'ACEPTADA_ALISTAMIENTO',
  },
  {
    id: 'q-003',
    quoteCode: 'COT-B2B-2026-098',
    clientCompany: 'Cadena Hotelera Valle Andino S.A.',
    clientRuc: '20491029381',
    contactPerson: 'Martín Paredes (Chef Ejecutivo)',
    productName: 'Ají de Gallina Liofilizado Tradicional (45g)',
    boxesCount: 4,
    unitsPerBox: 24,
    totalUnits: 96,
    unitPricePen: 16.50,
    totalPen: 1584.00,
    deliveryDestination: 'Jr. Miraflores 120, Miraflores, Lima',
    requestedDate: '30 de Octubre, 2026',
    paymentTerms: 'Contado contra entrega en Lima',
    status: 'PENDIENTE',
  },
];

export default function CotizacionesRecibidasPage() {
  const [quotes, setQuotes] = useState<ProducerQuote[]>(INITIAL_QUOTES);
  const [activeFilter, setActiveFilter] = useState<'TODAS' | 'PENDIENTE' | 'ACEPTADA_ALISTAMIENTO'>('TODAS');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, status: 'ACEPTADA_ALISTAMIENTO' } : q
      )
    );
    setActionMessage('Cotización aceptada. Se generó la orden de preparación en el Acopio Seco de Lima.');
    setTimeout(() => setActionMessage(null), 3500);
  };

  const filteredQuotes = quotes.filter((q) => {
    if (activeFilter === 'TODAS') return true;
    return q.status === activeFilter;
  });

  const totalValuePen = quotes.reduce((acc, q) => acc + q.totalPen, 0);
  const pendingCount = quotes.filter((q) => q.status === 'PENDIENTE').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado y Navegación */}
      <div>
        <Link
          href="/producer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Productos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
              Cotizaciones B2B Recibidas
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              Solicitudes por volumen de restaurantes, hoteles y tiendas minoristas recibidas en ALTOQ PE.
            </p>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-brand-md text-amber-900 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>{pendingCount} cotizaciones por responder</span>
          </div>
        </div>
      </div>

      {/* Alerta de Acción Realizada */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-brand-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tarjetas Resumen de Cartera B2B */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="text-brand-text-muted text-xs font-bold uppercase">
            Total en Cotizaciones B2B
          </div>
          <div className="text-2xl font-black text-brand-primary mt-1">
            S/ {totalValuePen.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Valor de 3 pedidos institucionales
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="text-brand-text-muted text-xs font-bold uppercase">
            Pendientes de Aprobación
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {pendingCount} solicitudes
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">
            Tiempo promedio de respuesta sugerido: &lt; 24h
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
          <div className="text-brand-text-muted text-xs font-bold uppercase">
            Garantía de Cobranza ALTOQ
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            100% Asegurada
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            Despacho contra depósito en cuenta recaudadora
          </div>
        </div>
      </div>

      {/* Filtros de Pestaña */}
      <div className="flex space-x-2 border-b border-gray-200 text-xs font-bold pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter('TODAS')}
          className={`py-2 px-4 rounded-t-lg transition-colors ${
            activeFilter === 'TODAS'
              ? 'bg-brand-primary text-white font-extrabold shadow-sm'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Todas ({quotes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('PENDIENTE')}
          className={`py-2 px-4 rounded-t-lg transition-colors ${
            activeFilter === 'PENDIENTE'
              ? 'bg-brand-primary text-white font-extrabold shadow-sm'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Pendientes ({quotes.filter((q) => q.status === 'PENDIENTE').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('ACEPTADA_ALISTAMIENTO')}
          className={`py-2 px-4 rounded-t-lg transition-colors ${
            activeFilter === 'ACEPTADA_ALISTAMIENTO'
              ? 'bg-brand-primary text-white font-extrabold shadow-sm'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Aceptadas / En Alistamiento ({quotes.filter((q) => q.status === 'ACEPTADA_ALISTAMIENTO').length})
        </button>
      </div>

      {/* Listado de Cotizaciones */}
      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white border border-brand-primary/10 rounded-brand-xl p-5 shadow-sm space-y-4 hover:border-brand-primary/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-brand-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-brand-primary">
                  <Building2 className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-brand-primary">
                    {quote.clientCompany}
                  </h3>
                  <div className="text-[11px] text-gray-500 font-mono">
                    RUC: {quote.clientRuc} • Contacto: {quote.contactPerson}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                  {quote.quoteCode}
                </span>
                {quote.status === 'PENDIENTE' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Pendiente de Respuesta
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Aceptada (En Alistamiento)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Producto Solicitado:</span>
                <strong className="text-brand-primary font-bold">{quote.productName}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Volumen Requerido:</span>
                <span className="text-gray-800 font-semibold">
                  {quote.boxesCount} cajas ({quote.totalUnits} pouches de {quote.unitsPerBox} u.)
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Precio Ofertado por Unidad:</span>
                <span className="text-brand-primary font-black text-sm">
                  S/ {quote.unitPricePen.toFixed(2)}
                </span>
                <span className="text-[10px] text-gray-500 block">Total: S/ {quote.totalPen.toFixed(2)} con IGV</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Lugar y Fecha de Entrega:</span>
                <div className="flex items-center space-x-1 text-gray-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-secondary flex-shrink-0" />
                  <span className="truncate">{quote.deliveryDestination}</span>
                </div>
                <div className="text-[10px] text-gray-500">Para el {quote.requestedDate}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-100 gap-3">
              <div className="text-[11px] text-brand-text-muted">
                <strong>Condición Comercial:</strong> {quote.paymentTerms}
              </div>

              <div className="flex items-center space-x-2">
                {quote.status === 'PENDIENTE' && (
                  <button
                    type="button"
                    onClick={() => handleAcceptQuote(quote.id)}
                    className="px-4 py-2 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-extrabold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aceptar Cotización B2B</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActionMessage(`Generando y descargando Ficha Técnica y Cotización ${quote.quoteCode}.pdf`);
                    setTimeout(() => setActionMessage(null), 3500);
                  }}
                  className="px-3 py-2 rounded-brand-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Descargar Ficha / PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
