'use client';

import React, { useState } from 'react';
import { useMarketplace } from './MarketplaceContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PackageCheck,
  Truck,
  MapPin,
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';
import type { StoredOrder } from '@/lib/storage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    currentRole,
    currentUser,
    refreshUser,
    altoqCreditsBalance,
    useAltoqCreditsDiscount,
    setUseAltoqCreditsDiscount,
    setIsOrdersOpen,
  } = useMarketplace();

  const [paymentStep, setPaymentStep] = useState<'CART' | 'PROCESSING' | 'CHECKOUT_SUCCESS'>('CART');
  const [createdOrder, setCreatedOrder] = useState<StoredOrder | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Cálculo de Subtotales
  const subtotalPen = cart.reduce((acc, item) => {
    const unitPrice =
      currentRole === 'CONSUMER_WHOLESALE'
        ? item.product.wholesalePricePen || item.product.publicPricePen * 0.75
        : item.product.publicPricePen;
    return acc + unitPrice * item.quantity;
  }, 0);

  // Flete promedio Lima
  const shippingPen = subtotalPen > 0 ? (subtotalPen >= 150 ? 0 : 8.5) : 0;

  // Descuento por Altoq Créditos
  const creditsDiscountPen =
    useAltoqCreditsDiscount && subtotalPen > 0
      ? Math.min(altoqCreditsBalance, subtotalPen)
      : 0;

  const totalPen = Math.max(0, subtotalPen + shippingPen - creditsDiscountPen);

  // Procesar Orden Real
  const handleConfirmOrder = async () => {
    setOrderError(null);
    setPaymentStep('PROCESSING');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotalPen,
          shippingPen,
          creditsDiscountPen,
          totalPen,
          paymentMethod: currentUser?.preferredPaymentMethod || 'YAPE_PLIN',
          deliveryAddress: currentUser?.address || 'Av. Larco 743, Dpto 402, Miraflores, Lima',
          contactPhone: currentUser?.phone || '+51 984 123 456',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      setCreatedOrder(data.order);
      clearCart();
      await refreshUser();
      setPaymentStep('CHECKOUT_SUCCESS');
    } catch (err: any) {
      setOrderError(err.message || 'No se pudo generar la orden');
      setPaymentStep('CART');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Fondo Oscuro con Desenfoque */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setPaymentStep('CART');
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* 1. Cabecera del Carrito */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-bg/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-extrabold text-brand-primary">
                {paymentStep === 'CHECKOUT_SUCCESS' ? 'Confirmación de Pedido' : 'Tu Canasta de Alimentos'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                setPaymentStep('CART');
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error si ocurre */}
          {orderError && (
            <div className="p-3 mx-4 mt-3 bg-red-50 border border-red-200 rounded-brand-md text-xs text-red-700">
              {orderError}
            </div>
          )}

          {/* 2. Lista de Productos o Mensaje de Éxito */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {paymentStep === 'CHECKOUT_SUCCESS' && createdOrder ? (
              <div className="py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-brand-primary">
                    ¡Pedido Recibido con Éxito!
                  </h3>
                  <div className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary font-mono font-bold text-xs rounded-full">
                    Orden {createdOrder.orderNumber}
                  </div>
                </div>

                {/* Resumen de Entrega Real */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-brand-lg space-y-2.5 text-xs">
                  <div className="flex items-start space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-brand-primary">Dirección de Despacho en Lima:</span>
                      <span>{createdOrder.deliveryAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700 pt-1 border-t border-gray-200">
                    <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-brand-primary">Contacto para Entrega: </span>
                      <span>{createdOrder.contactPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700 pt-1 border-t border-gray-200">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-brand-primary">Total Pagado: </span>
                      <strong className="text-emerald-800">S/ {createdOrder.totalPen.toFixed(2)}</strong> ({createdOrder.paymentMethod})
                    </div>
                  </div>
                </div>

                {/* Línea de Tiempo de las 4 Fases de Despacho en Lima */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-brand-lg space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block">
                    Seguimiento en Vivo:
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2.5 font-bold text-emerald-900">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</div>
                      <span>Pago Validado en Plataforma</span>
                    </div>
                    <div className="flex items-center space-x-2.5 font-bold text-emerald-900">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] animate-pulse">2</div>
                      <span>Alistado en Centro de Acopio Seco Lima (&lt;50% HR)</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">3</div>
                      <span>En Ruta Courier Lima Metropolitana</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">4</div>
                      <span>Entregado en Domicilio con Garantía de Satisfacción</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsOrdersOpen(true);
                      setPaymentStep('CART');
                    }}
                    className="w-full py-2.5 rounded-brand-md bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-light transition-colors"
                  >
                    Ver en "Mis Pedidos"
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setPaymentStep('CART');
                    }}
                    className="w-full py-2 rounded-brand-md border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
                  >
                    Seguir Explorando el Catálogo
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-brand-text-muted">
                  Tu canasta está vacía
                </p>
                <p className="text-xs text-gray-400">
                  Explora el catálogo de alimentos liofilizados y añade tus favoritos.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice =
                  currentRole === 'CONSUMER_WHOLESALE'
                    ? item.product.wholesalePricePen || item.product.publicPricePen * 0.75
                    : item.product.publicPricePen;

                return (
                  <div
                    key={`${item.product.id}-${item.isWholesaleBox ? 'box' : 'unit'}`}
                    className="flex items-center space-x-3 p-3 rounded-brand-lg border border-gray-100 bg-gray-50/60"
                  >
                    <div className="w-14 h-14 bg-white rounded p-1 flex items-center justify-center border border-gray-200 flex-shrink-0">
                      <img
                        src={item.product.packagingPhotoUrl}
                        alt={item.product.commercialName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-primary truncate">
                        {item.product.commercialName}
                      </h4>
                      <div className="text-[11px] text-gray-500">
                        {item.isWholesaleBox ? 'Presentación: Caja máster' : 'Pouch individual'}
                      </div>
                      <div className="text-xs font-black text-brand-primary mt-1">
                        S/ {(unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center space-x-1 border border-gray-300 rounded bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - (item.isWholesaleBox ? item.product.wholesaleMoqUnits : 1)
                          )
                        }
                        className="p-1 text-gray-500 hover:text-brand-primary"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1.5 text-xs font-bold text-brand-primary">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + (item.isWholesaleBox ? item.product.wholesaleMoqUnits : 1)
                          )
                        }
                        className="p-1 text-gray-500 hover:text-brand-primary"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}

            {/* Billetera Altoq Créditos */}
            {paymentStep === 'CART' && cart.length > 0 && currentRole === 'CONSUMER_RETAIL' && (
              <div className="p-3 bg-emerald-50 rounded-brand-md border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Altoq Créditos Disponibles</span>
                  </div>
                  <strong className="text-emerald-900">S/ {altoqCreditsBalance.toFixed(2)}</strong>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer text-[11px] text-emerald-800">
                  <input
                    type="checkbox"
                    checked={useAltoqCreditsDiscount}
                    onChange={(e) => setUseAltoqCreditsDiscount(e.target.checked)}
                    className="rounded border-emerald-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Aplicar saldo de garantía a este pedido</span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Totales y Botón de Pago */}
          {paymentStep === 'CART' && cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-brand-bg/40 space-y-3">
              <div className="space-y-1.5 text-xs text-brand-text-muted">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-brand-primary">S/ {subtotalPen.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flete en Lima:</span>
                  <span>{shippingPen === 0 ? '¡Envío Gratis!' : `S/ ${shippingPen.toFixed(2)}`}</span>
                </div>
                {creditsDiscountPen > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento Altoq Créditos:</span>
                    <span>- S/ {creditsDiscountPen.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-brand-primary pt-2 border-t border-gray-200">
                  <span>Total a Pagar (con IGV):</span>
                  <span className="text-base text-brand-primary">S/ {totalPen.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-3 rounded-brand-md bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-light transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Confirmar Pedido Real ({currentUser?.preferredPaymentMethod || 'Yape / Plin / Tarjeta'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
