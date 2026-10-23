'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Truck,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  QrCode,
  Building,
  Sparkles,
  Lock,
  Check,
  AlertCircle
} from 'lucide-react';
import type { StoredOrder } from '@/lib/storage';
import type { PaymentMethod } from '@/types';

type CheckoutStep = 'CART' | 'SHIPPING' | 'PAYMENT' | 'PROCESSING' | 'CHECKOUT_SUCCESS';

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

  const [step, setStep] = useState<CheckoutStep>('CART');
  const [createdOrder, setCreatedOrder] = useState<StoredOrder | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [processingStatusText, setProcessingStatusText] = useState('Iniciando pago seguro...');

  // Datos de envío en Lima (editables sin restricciones de caracteres)
  const [shippingAddress, setShippingAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Método de pago seleccionado
  const [selectedMethod, setSelectedMethod] = useState<'TARJETA_CULQI' | 'YAPE_PLIN' | 'TRANSFERENCIA_BCP' | 'ALTOQ_CREDITS'>('YAPE_PLIN');

  // Datos de tarjeta (sin restricciones de longitud para facilitar pruebas rápidas)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Datos de transferencia / Yape
  const [operationCode, setOperationCode] = useState('');

  // Inicializar datos con el perfil del usuario actual cuando se abre el carrito
  useEffect(() => {
    if (currentUser) {
      setShippingAddress(currentUser.address || 'Av. Javier Prado Este 2450, Dpto 401, San Borja, Lima');
      setRecipientName(currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Carlos Mendoza');
      setContactPhone(currentUser.phone || '+51 984 123 456');
    } else {
      setShippingAddress('Av. Larco 743, Miraflores, Lima');
      setRecipientName('Comprador ALTOQ PE');
      setContactPhone('+51 984 123 456');
    }
  }, [currentUser, isCartOpen]);

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

  // Autocompletar tarjeta de prueba con 1 solo clic
  const handleAutofillTestCard = () => {
    setCardNumber('4557 8200 1234 5678');
    setCardHolder(recipientName || 'Carlos Mendoza');
    setCardExpiry('12/28');
    setCardCvv('849');
  };

  // Autocompletar código de operación Yape
  const handleAutofillYape = () => {
    setOperationCode(`YAP-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Simulación de Pago Real y Creación de Orden
  const handleExecutePayment = async () => {
    setOrderError(null);
    setStep('PROCESSING');

    // Simulación progresiva de pasarela de pago y validación
    setProcessingStatusText(
      selectedMethod === 'TARJETA_CULQI'
        ? 'Conectando con pasarela segura Culqi / Visa...'
        : selectedMethod === 'YAPE_PLIN'
        ? 'Verificando recepción de transferencia Yape / Plin...'
        : selectedMethod === 'TRANSFERENCIA_BCP'
        ? 'Confirmando número de operación bancaria BCP...'
        : 'Validando saldo de ALTOQ Créditos...'
    );

    await new Promise((r) => setTimeout(r, 600));
    setProcessingStatusText('Validando lote de alimentos liofilizados en acopio Lima...');
    await new Promise((r) => setTimeout(r, 600));
    setProcessingStatusText('Generando orden con garantía DIGESA y comprobante...');

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
          paymentMethod: selectedMethod as PaymentMethod,
          deliveryAddress: shippingAddress || 'Lima Metropolitana',
          contactPhone: contactPhone || '+51 984 123 456',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      setCreatedOrder(data.order);
      clearCart();
      await refreshUser();
      setStep('CHECKOUT_SUCCESS');
    } catch (err: any) {
      setOrderError(err.message || 'No se pudo generar la orden de compra.');
      setStep('PAYMENT');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Fondo Oscuro con Desenfoque */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setStep('CART');
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          {/* Cabecera del Drawer */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-brand-bg/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-extrabold text-brand-primary">
                {step === 'CART' && 'Tu Canasta de Alimentos'}
                {step === 'SHIPPING' && 'Paso 1: Datos de Despacho en Lima'}
                {step === 'PAYMENT' && 'Paso 2: Simulación de Pago'}
                {step === 'PROCESSING' && 'Procesando Transacción'}
                {step === 'CHECKOUT_SUCCESS' && '¡Pedido Confirmado con Éxito!'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                setStep('CART');
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensaje de Error si ocurre */}
          {orderError && (
            <div className="p-3 mx-4 mt-3 bg-red-50 border border-red-200 rounded-brand-md text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          {/* CUERPO PRINCIPAL SEGÚN EL PASO ACTIVO */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* ========================================================================= */}
            {/* PASO 1: REVISIÓN DE CANASTA */}
            {/* ========================================================================= */}
            {step === 'CART' && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-brand-text-muted">Tu canasta está vacía</p>
                    <p className="text-xs text-gray-400">
                      Explora el catálogo de alimentos liofilizados y añade tus favoritos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const unitPrice =
                        currentRole === 'CONSUMER_WHOLESALE'
                          ? item.product.wholesalePricePen || item.product.publicPricePen * 0.75
                          : item.product.publicPricePen;

                      return (
                        <div
                          key={`${item.product.id}-${item.isWholesaleBox ? 'box' : 'unit'}`}
                          className="flex items-center space-x-3 p-3 rounded-brand-lg border border-gray-100 bg-brand-bg/40"
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
                    })}

                    {/* Descuento por Altoq Créditos */}
                    {altoqCreditsBalance > 0 && (
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
                )}
              </>
            )}

            {/* ========================================================================= */}
            {/* PASO 2: DATOS DE DESPACHO EN LIMA */}
            {/* ========================================================================= */}
            {step === 'SHIPPING' && (
              <div className="space-y-4">
                <div className="p-3 bg-brand-bg rounded-brand-md border border-brand-primary/10 text-xs text-brand-text-muted flex items-start space-x-2">
                  <Truck className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Despacho directo desde el <strong>Centro de Acopio Seco Lima</strong> con empaque tricapa hermético y courier certificado.
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-primary mb-1">
                      Nombre y Apellidos de quien recibe
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-primary mb-1">
                      Teléfono Móvil (WhatsApp de coordinación)
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Ej. 984 123 456"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-primary mb-1">
                      Dirección de Entrega en Lima (con distrito)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Av. Larco 743, Dpto 402, Miraflores, Lima"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 3: SIMULACIÓN DE MÉTODOS DE PAGO (QR, TARJETA, BCP, CRÉDITOS) */}
            {/* ========================================================================= */}
            {step === 'PAYMENT' && (
              <div className="space-y-4">
                {/* Selector de Pestañas de Pago */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-brand-md text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('YAPE_PLIN')}
                    className={`py-2 px-1 rounded text-center transition-all flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                      selectedMethod === 'YAPE_PLIN'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-gray-600 hover:text-purple-700'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Yape / Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('TARJETA_CULQI')}
                    className={`py-2 px-1 rounded text-center transition-all flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                      selectedMethod === 'TARJETA_CULQI'
                        ? 'bg-[#0F3D2E] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#0F3D2E]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('TRANSFERENCIA_BCP')}
                    className={`py-2 px-1 rounded text-center transition-all flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                      selectedMethod === 'TRANSFERENCIA_BCP'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'text-gray-600 hover:text-blue-800'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-[11px]">BCP</span>
                  </button>
                </div>

                {/* OPCIÓN 1: PAGO CON CÓDIGO QR YAPE / PLIN */}
                {selectedMethod === 'YAPE_PLIN' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-brand-lg space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                          Y
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-purple-950">Pago Inmediato con QR</h4>
                          <span className="text-[10px] text-purple-700">Yape &amp; Plin oficial</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-purple-950">
                        Total: S/ {totalPen.toFixed(2)}
                      </span>
                    </div>

                    {/* Gráfico QR de Yape */}
                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                      <div className="p-3 bg-white rounded-brand-md border-2 border-purple-300 shadow-sm">
                        {/* SVG QR Visual */}
                        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner Squares */}
                          <rect x="10" y="10" width="24" height="24" rx="3" fill="#6B21A8" />
                          <rect x="14" y="14" width="16" height="16" fill="white" />
                          <rect x="18" y="18" width="8" height="8" fill="#6B21A8" />

                          <rect x="66" y="10" width="24" height="24" rx="3" fill="#6B21A8" />
                          <rect x="70" y="14" width="16" height="16" fill="white" />
                          <rect x="74" y="18" width="8" height="8" fill="#6B21A8" />

                          <rect x="10" y="66" width="24" height="24" rx="3" fill="#6B21A8" />
                          <rect x="14" y="70" width="16" height="16" fill="white" />
                          <rect x="18" y="74" width="8" height="8" fill="#6B21A8" />

                          {/* Data points */}
                          <rect x="42" y="12" width="6" height="6" fill="#06B6D4" />
                          <rect x="52" y="12" width="6" height="6" fill="#6B21A8" />
                          <rect x="42" y="24" width="8" height="6" fill="#6B21A8" />
                          <rect x="48" y="34" width="6" height="6" fill="#06B6D4" />
                          <rect x="12" y="44" width="6" height="6" fill="#6B21A8" />
                          <rect x="22" y="44" width="6" height="8" fill="#06B6D4" />
                          <rect x="36" y="44" width="8" height="8" fill="#6B21A8" />
                          <rect x="50" y="44" width="14" height="6" fill="#6B21A8" />
                          <rect x="72" y="44" width="8" height="8" fill="#06B6D4" />
                          <rect x="86" y="44" width="6" height="6" fill="#6B21A8" />
                          <rect x="42" y="58" width="6" height="6" fill="#6B21A8" />
                          <rect x="54" y="58" width="8" height="6" fill="#06B6D4" />
                          <rect x="42" y="72" width="8" height="6" fill="#6B21A8" />
                          <rect x="58" y="72" width="6" height="8" fill="#6B21A8" />
                          <rect x="72" y="66" width="6" height="6" fill="#06B6D4" />
                          <rect x="82" y="66" width="8" height="6" fill="#6B21A8" />
                          <rect x="72" y="80" width="12" height="6" fill="#6B21A8" />
                        </svg>
                      </div>

                      <div className="text-center text-xs space-y-0.5">
                        <div className="font-extrabold text-purple-950">Yapear a: 984 123 456</div>
                        <div className="text-[10px] text-purple-700">Titular: ALTOQ PE FOOD TECHNOLOGY S.A.C.</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-purple-950">
                          Código de Operación Yape (opcional)
                        </label>
                        <button
                          type="button"
                          onClick={handleAutofillYape}
                          className="text-[10px] font-bold text-purple-700 hover:underline"
                        >
                          Generar Código Automático
                        </button>
                      </div>
                      <input
                        type="text"
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="Ej. YAP-849201"
                        className="w-full px-3 py-2 text-xs border border-purple-200 rounded-brand-md focus:border-purple-600 focus:outline-none font-mono bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* OPCIÓN 2: PAGO CON TARJETA (SIN RESTRICCIÓN DE LONGITUD) */}
                {selectedMethod === 'TARJETA_CULQI' && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-brand-lg space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-800" />
                        <span className="font-extrabold text-xs text-brand-primary">Pasarela Segura SSL</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutofillTestCard}
                        className="text-[10px] font-bold text-emerald-700 hover:text-brand-primary underline"
                      >
                        Autocompletar Tarjeta de Prueba
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-brand-primary mb-1">
                          Número de Tarjeta (escribe cualquier cantidad de dígitos)
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4557 8200 1234 5678"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-brand-primary mb-1">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Ej. Carlos Mendoza"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-brand-primary mb-1">
                            Vencimiento (MM/AA)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-brand-primary mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="849"
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* OPCIÓN 3: PAGO POR TRANSFERENCIA BANCARIA BCP */}
                {selectedMethod === 'TRANSFERENCIA_BCP' && (
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-brand-lg space-y-3 animate-fadeIn">
                    <div className="flex items-center space-x-2 border-b border-blue-100 pb-2">
                      <Building className="w-4 h-4 text-blue-900" />
                      <span className="font-extrabold text-xs text-blue-950">Cuenta Corriente BCP Soles</span>
                    </div>

                    <div className="text-xs space-y-1.5 text-blue-950">
                      <div>
                        <span className="text-[10px] text-blue-700 block">Número de Cuenta BCP:</span>
                        <strong className="font-mono">193-982341-0-28</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-700 block">Código Interbancario (CCI):</span>
                        <strong className="font-mono">002-19300982341028-14</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-700 block">Razón Social:</span>
                        <span>ALTOQ PE FOOD TECHNOLOGY S.A.C.</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-100">
                      <label className="block text-[11px] font-bold text-blue-950 mb-1">
                        Número de Operación Bancaria (opcional)
                      </label>
                      <input
                        type="text"
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="Ej. BCP-5820192"
                        className="w-full px-3 py-2 text-xs border border-blue-200 rounded-brand-md focus:border-blue-600 focus:outline-none font-mono bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 4: SIMULACIÓN DE PROCESAMIENTO (SPINNER Y ESTADOS) */}
            {/* ========================================================================= */}
            {step === 'PROCESSING' && (
              <div className="py-16 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 border-4 border-[#0F3D2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-brand-primary">{processingStatusText}</h3>
                  <p className="text-xs text-brand-text-muted">
                    No cierres esta ventana. Tu pago está siendo validado de forma segura.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 5: PEDIDO CONFIRMADO (ÉXITO REAL) */}
            {/* ========================================================================= */}
            {step === 'CHECKOUT_SUCCESS' && createdOrder && (
              <div className="py-4 space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-brand-primary">¡Pago Validado y Pedido Confirmado!</h3>
                  <div className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary font-mono font-bold text-xs rounded-full">
                    Orden {createdOrder.orderNumber}
                  </div>
                </div>

                {/* Resumen de Entrega */}
                <div className="p-4 bg-brand-bg border border-brand-primary/15 rounded-brand-lg space-y-2.5 text-xs">
                  <div className="flex items-start space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-brand-primary">Destino de Despacho en Lima:</span>
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

                {/* Línea de Tiempo de 4 Fases de Despacho */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-brand-lg space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block">
                    Seguimiento en Vivo de tu Alimento Liofilizado:
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
                      <span>Entregado en Domicilio con Garantía de Calidad</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsOrdersOpen(true);
                      setStep('CART');
                    }}
                    className="w-full py-2.5 rounded-brand-md bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-light transition-colors"
                  >
                    Ver en "Mis Pedidos"
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setStep('CART');
                    }}
                    className="w-full py-2 rounded-brand-md border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
                  >
                    Seguir Comprando en el Marketplace
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BARRA INFERIOR DE ACCIONES Y TOTALES */}
          {cart.length > 0 && step !== 'PROCESSING' && step !== 'CHECKOUT_SUCCESS' && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-brand-bg/40 space-y-3">
              <div className="space-y-1 text-xs text-brand-text-muted">
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

              {/* Botones de Navegación entre pasos */}
              <div className="flex items-center space-x-2 pt-1">
                {step === 'CART' && (
                  <button
                    type="button"
                    onClick={() => setStep('SHIPPING')}
                    className="w-full py-3 rounded-brand-md bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-light transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Continuar al Despacho en Lima</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {step === 'SHIPPING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep('CART')}
                      className="px-3 py-3 rounded-brand-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('PAYMENT')}
                      className="flex-1 py-3 rounded-brand-md bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-light transition-colors flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>Elegir Método de Pago</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {step === 'PAYMENT' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep('SHIPPING')}
                      className="px-3 py-3 rounded-brand-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-xs font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      className="flex-1 py-3 rounded-brand-md bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-light transition-colors flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>
                        Simular y Pagar S/ {totalPen.toFixed(2)} ({selectedMethod === 'YAPE_PLIN' ? 'Yape' : selectedMethod === 'TARJETA_CULQI' ? 'Tarjeta' : 'BCP'})
                      </span>
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
