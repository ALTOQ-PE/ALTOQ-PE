'use client';

import React, { useEffect, useState } from 'react';
import { useMarketplace } from './MarketplaceContext';
import {
  FileText,
  X,
  Building2,
  CheckCircle2,
  Send,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Download
} from 'lucide-react';
import type { WholesaleQuote } from '@/types';

export const QuoteModal: React.FC = () => {
  const { isQuoteModalOpen, setIsQuoteModalOpen, approvedProducts, currentUser } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'NEW_QUOTE' | 'HISTORY'>('NEW_QUOTE');
  const [quotes, setQuotes] = useState<WholesaleQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Formulario de Nueva Cotización
  const [companyName, setCompanyName] = useState(currentUser?.companyName || 'Operadora Gastronómica Peruana S.A.C.');
  const [companyRuc, setCompanyRuc] = useState(currentUser?.companyRuc || '20608912341');
  const [contactName, setContactName] = useState(
    currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Miguel Vargas'
  );
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'compras@horecandina.com');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+51 972 345 678');

  // Selección de Productos para Cotizar por Caja
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<Record<string, number>>({
    'prod-001': 5, // 5 cajas de Ají de gallina
    'prod-002': 3, // 3 cajas de Sopa criolla
  });

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
      }
    } catch (err) {
      console.error('Error al cargar cotizaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isQuoteModalOpen) {
      fetchQuotes();
      if (currentUser?.companyName) setCompanyName(currentUser.companyName);
      if (currentUser?.companyRuc) setCompanyRuc(currentUser.companyRuc);
      if (currentUser?.email) setContactEmail(currentUser.email);
      if (currentUser?.phone) setContactPhone(currentUser.phone);
    }
  }, [isQuoteModalOpen, currentUser]);

  if (!isQuoteModalOpen) return null;

  // Actualizar cantidad de cajas
  const handleQuantityChange = (productId: string, boxes: number) => {
    setSelectedProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, boxes),
    }));
  };

  // Calcular subtotal preliminar de cotización
  const quoteItems = approvedProducts
    .filter((p) => (selectedProductQuantities[p.id] || 0) > 0)
    .map((p) => {
      const boxCount = selectedProductQuantities[p.id];
      const pricePerBoxPen = (p.wholesalePricePen || p.publicPricePen * 0.75) * p.wholesaleMoqUnits;
      return {
        productId: p.id,
        productName: p.commercialName,
        boxCount,
        unitsPerBox: p.wholesaleMoqUnits,
        pricePerBoxPen,
        totalItemPen: pricePerBoxPen * boxCount,
      };
    });

  const subtotalPen = quoteItems.reduce((acc, item) => acc + item.totalItemPen, 0);
  const igvPen = subtotalPen * 0.18;
  const totalPen = subtotalPen + igvPen;

  // Enviar Cotización Formal
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (quoteItems.length === 0) {
      setFeedbackMessage('Debes seleccionar al menos una caja de producto para cotizar.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          companyRuc,
          contactName,
          contactEmail,
          contactPhone,
          items: quoteItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al emitir cotización');
      }

      await fetchQuotes();
      setActiveTab('HISTORY');
      setFeedbackMessage(`Cotización ${data.quote.quoteNumber} generada formalmente.`);
    } catch (err: any) {
      setFeedbackMessage(err.message || 'Error al generar cotización');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsQuoteModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-brand-xl shadow-2xl border border-brand-primary/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="bg-[#0A291F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base">
                Módulo Mayorista B2B: Cotizaciones con RUC
              </h3>
              <p className="text-[11px] text-emerald-100">
                Precios por caja máster • Ficha técnica y registro DIGESA incluidos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(false)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas: Nueva Cotización / Historial */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('NEW_QUOTE');
              setFeedbackMessage(null);
            }}
            className={`py-3 text-center transition-colors ${
              activeTab === 'NEW_QUOTE'
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary font-extrabold'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
          >
            Solicitar Nueva Cotización
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('HISTORY');
              setFeedbackMessage(null);
            }}
            className={`py-3 text-center transition-colors ${
              activeTab === 'HISTORY'
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary font-extrabold'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
          >
            Historial de Cotizaciones ({quotes.length})
          </button>
        </div>

        {/* Notificación si existe */}
        {feedbackMessage && (
          <div className="m-4 mb-0 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
            {feedbackMessage}
          </div>
        )}

        {/* Contenido según pestaña */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'NEW_QUOTE' ? (
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              {/* Datos de la Empresa Solicitante */}
              <div className="p-3.5 bg-gray-50 rounded-brand-md border border-gray-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-primary block">
                  Datos de Facturación del Comprador
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Razón Social *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">RUC (11 dígitos) *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={companyRuc}
                      onChange={(e) => setCompanyRuc(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-gray-200">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contacto Comercial</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Selector de Cajas por Alimento */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-brand-primary block">
                  Selecciona la cantidad de Cajas Máster a cotizar:
                </span>

                <div className="space-y-2">
                  {approvedProducts.map((product) => {
                    const pricePerBox = (product.wholesalePricePen || product.publicPricePen * 0.75) * product.wholesaleMoqUnits;
                    const count = selectedProductQuantities[product.id] || 0;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-brand-md border border-gray-200 bg-white hover:border-brand-primary/40 text-xs"
                      >
                        <div className="flex-1 pr-3">
                          <h4 className="font-bold text-brand-primary">{product.commercialName}</h4>
                          <span className="text-[11px] text-gray-500 block">
                            Caja Máster x {product.wholesaleMoqUnits} u. • DIGESA: {product.digesaCode}
                          </span>
                          <span className="font-mono text-emerald-800 font-bold text-[11px]">
                            S/ {pricePerBox.toFixed(2)} por caja
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={count}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-bold font-mono border border-gray-300 rounded focus:border-brand-primary focus:outline-none text-xs"
                          />
                          <span className="text-gray-500 text-xs">cajas</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resumen de Cotización */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-brand-md text-xs space-y-1.5">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal Cajas:</span>
                  <span className="font-mono font-bold">S/ {subtotalPen.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IGV (18%):</span>
                  <span className="font-mono font-bold">S/ {igvPen.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-primary font-black text-sm pt-1 border-t border-emerald-200">
                  <span>Total Cotización:</span>
                  <span className="font-mono">S/ {totalPen.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || quoteItems.length === 0}
                className="w-full py-3 bg-[#0F3D2E] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#18523f] transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'Generando cotización...' : 'Emitir Cotización Formal y Enviar al Correo'}</span>
              </button>
            </form>
          ) : (
            /* TAB 2: HISTORIAL */
            <div className="space-y-3">
              {quotes.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No hay cotizaciones previas</p>
                  <p className="text-xs text-gray-400">
                    Crea tu primera cotización en la pestaña anterior para recibir precios mayoristas con RUC.
                  </p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-brand-lg border border-gray-200 bg-gray-50/60 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <span className="font-mono font-black text-brand-primary text-sm">
                          {quote.quoteNumber}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          Emitida para: {quote.companyName} (RUC: {quote.companyRuc})
                        </span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                        Vigente hasta {new Date(quote.validUntil).toLocaleDateString('es-PE')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {quote.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700 text-xs">
                          <span>
                            • {item.boxCount} cajas x {item.unitsPerBox} u. de {item.productName}
                          </span>
                          <span className="font-mono font-semibold">
                            S/ {item.totalItemPen.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Atención prioritaria comercial ALTOQ PE</span>
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Total con IGV</span>
                        <strong className="text-sm font-mono text-brand-primary">
                          S/ {quote.totalPen.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-500">
            Validez garantizada por 15 días calendario
          </span>
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(false)}
            className="px-4 py-2 bg-[#0F3D2E] text-white font-bold rounded-brand-md text-xs hover:bg-[#18523f] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
