'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MarketplaceProvider, useMarketplace } from '@/components/marketplace/MarketplaceContext';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { OrdersModal } from '@/components/marketplace/OrdersModal';
import { QuoteModal } from '@/components/marketplace/QuoteModal';
import { ProducerProductModal } from '@/components/marketplace/ProducerProductModal';
import { DigesaCertificateViewer } from '@/components/landing/DigesaCertificateViewer';
import { YoutubeRecipeEmbed } from '@/components/landing/YoutubeRecipeEmbed';
import type { CatalogProduct, ProductReview } from '@/types';
import {
  Star,
  ShieldCheck,
  Award,
  Clock,
  Box,
  Truck,
  CheckCircle2,
  ChevronRight,
  Flame,
  FileText,
  MessageSquare,
  ThumbsUp,
  Share2,
  ShoppingCart,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  UserCheck
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const productId = params?.id as string;
  const {
    approvedProducts,
    currentRole,
    consumerPlan,
    addToCart,
    addProductReview,
    currentUser,
  } = useMarketplace();

  // Buscar producto por ID o slug
  const product = useMemo(() => {
    return approvedProducts.find((p) => p.id === productId || p.slug === productId);
  }, [approvedProducts, productId]);

  // Galería de fotos
  const photos = useMemo(() => {
    if (!product) return [];
    if (product.galleryPhotos && product.galleryPhotos.length > 0) {
      return product.galleryPhotos;
    }
    const list: string[] = [];
    if (product.packagingPhotoUrl) list.push(product.packagingPhotoUrl);
    if (product.dishPhotoUrl) list.push(product.dishPhotoUrl);
    list.push('/assets/products/box-delivery.png');
    return list;
  }, [product]);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'tecnica' | 'reseñas'>('descripcion');
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  // Estado del formulario de nueva reseña
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F3EB]">
        <MarketplaceNavbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-black text-brand-primary">Producto no encontrado</h1>
          <p className="text-sm text-brand-text-muted">
            El alimento liofilizado solicitado no existe o fue retirado del catálogo disponible.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-brand-md bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo Principal</span>
          </Link>
        </div>
      </div>
    );
  }

  // Métricas del producto
  const yieldRatio = (product.rehydratedYieldGrams / product.netWeightGrams).toFixed(1);
  const currentRating = product.rating || 4.9;
  const currentReviews = product.reviews || [];
  const currentReviewsCount = product.reviewCount || currentReviews.length;

  // Precios según plan y rol
  const isGold = consumerPlan === 'PLAN_ORO';
  const unitPrice = isGold ? product.publicPricePen * 0.9 : product.publicPricePen;
  const savingsPerUnit = isGold ? product.publicPricePen * 0.1 : 0;
  const filipuntosEarned = Math.round(product.publicPricePen * (isGold ? 1.5 : 1.0));

  // Mayorista
  const wholesalePricePerUnit = product.wholesalePricePen || product.publicPricePen * 0.75;
  const wholesaleBoxPrice = wholesalePricePerUnit * product.wholesaleMoqUnits;

  // Manejar adición al carrito
  const handleAddToCart = () => {
    if (currentRole === 'CONSUMER_WHOLESALE') {
      addToCart(product, quantity * product.wholesaleMoqUnits, true);
    } else {
      addToCart(product, quantity, false);
    }
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  // Manejar envío de nueva reseña
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    const author =
      newUserName.trim() ||
      (currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Consumidor Verificado');

    addProductReview(product.id, {
      userName: author,
      userRole: isGold ? 'Minorista Oro' : 'Comprador Verificado',
      rating: newRating,
      verifiedPurchase: true,
      title: newTitle.trim(),
      comment: newComment.trim(),
    });

    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
    setReviewSuccessMessage(true);
    setTimeout(() => setReviewSuccessMessage(false), 5000);
  };

  // Desglose de estrellas para gráfico
  const starCounts = [5, 4, 3, 2, 1].map((s) => {
    const matching = currentReviews.filter((r) => r.rating === s).length;
    const percentage = currentReviews.length > 0 ? (matching / currentReviews.length) * 100 : s === 5 ? 85 : s === 4 ? 12 : 3;
    return { stars: s, count: matching, percentage };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EB]">
      {/* 1. Barra de Navegación Oficial */}
      <MarketplaceNavbar />

      {/* 2. Migajas de Pan (Breadcrumbs) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-xs text-brand-text-muted">
            <Link href="/" className="hover:text-brand-primary transition-colors font-medium">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/" className="hover:text-brand-primary transition-colors font-medium">
              Catálogo de Liofilizados
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">{product.originRegion}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-brand-primary truncate max-w-xs sm:max-w-md">
              {product.commercialName}
            </span>
          </nav>
        </div>
      </div>

      {/* 3. Contenedor Principal del Producto */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Columna Izquierda: Galería de Fotos (5 Columnas) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Foto Principal Ampliada */}
            <div className="bg-white border border-brand-primary/10 rounded-brand-2xl p-6 flex items-center justify-center min-h-[380px] sm:min-h-[440px] relative overflow-hidden shadow-sm group">
              <img
                src={photos[activePhotoIndex] || product.packagingPhotoUrl}
                alt={product.commercialName}
                className="max-h-[360px] max-w-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
              />

              {/* Insignia de Garantía Sanitaria */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.octagonCount === 0 ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm">
                    0 Octógonos • 100% Natural
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-black text-white shadow-sm">
                    {product.octagonCount} {product.octagonCount === 1 ? 'Octógono' : 'Octógonos'}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-surface-soft text-brand-primary border border-brand-primary/15">
                  Sublimación a -40 °C
                </span>
              </div>
            </div>

            {/* Fila de Miniaturas Seleccionables */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {photos.map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-brand-lg p-1.5 bg-white border-2 transition-all overflow-hidden flex items-center justify-center ${
                    activePhotoIndex === idx
                      ? 'border-brand-primary shadow-sm ring-2 ring-brand-primary/20'
                      : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Vista ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold text-gray-500 bg-white/90 px-1 rounded shadow-xs">
                    {idx === 0 ? 'Pouch' : idx === 1 ? 'Plato' : 'Caja'}
                  </span>
                </button>
              ))}
            </div>

            {/* Garantías de Entrega y Empaque */}
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-brand-xl p-4 space-y-2 text-xs text-emerald-950">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold text-emerald-900">Garantía Sanitaria y Calidad Total ALTOQ</strong>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Conservación molecular del 97% de nutrientes y sabor original. Si el pouch pierde el vacío hermético en ruta, te reembolsamos en ALTOQ Créditos inmediatamente.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1 border-t border-emerald-200/50 text-[11px] text-emerald-800">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Rehidratación completa en exactamente 3 minutos con agua caliente.</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información, Precio y Compra (7 Columnas) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cabecera del Producto */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-brand-secondary-dark uppercase tracking-wider bg-brand-surface-soft px-2.5 py-1 rounded-brand-sm">
                  {product.producerName} • {product.originRegion}
                </span>

                {/* Certificado DIGESA */}
                <DigesaCertificateViewer
                  digesaCode={product.digesaCode}
                  producerName={product.producerName}
                  productName={product.commercialName}
                  packagingBarrierType={product.packagingBarrierType}
                  qualityCertificatesUrls={product.qualityCertificatesUrls}
                  originRegion={product.originRegion}
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-brand-primary leading-tight">
                {product.commercialName}
              </h1>

              {/* Estrellas y Resumen de Calificación */}
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(currentRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-black text-brand-primary">
                  {currentRating.toFixed(1)} de 5
                </span>
                <span className="text-gray-300">•</span>
                <a
                  href="#reseñas"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('reseñas');
                    document.getElementById('seccion-reseñas')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-brand-secondary hover:underline font-bold"
                >
                  {currentReviewsCount} reseñas verificadas de clientes
                </a>
              </div>
            </div>

            {/* Resumen Cultural y Tecnológico */}
            <p className="text-sm text-brand-text-main leading-relaxed">
              {product.culturalContext}
            </p>

            {/* Cuadrícula de Especificaciones Físicas de Rendimiento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-white border border-brand-primary/10 rounded-brand-xl shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-500">Peso Neto Seco</span>
                <div className="text-base font-extrabold text-brand-primary">{product.netWeightGrams} g</div>
                <span className="text-[10px] text-gray-400">Pouch ultraliviano</span>
              </div>
              <div className="space-y-0.5 border-l border-gray-100 pl-3">
                <span className="text-[10px] uppercase font-bold text-gray-500">Rinde en Plato</span>
                <div className="text-base font-extrabold text-emerald-800">{product.rehydratedYieldGrams} g</div>
                <span className="text-[10px] text-emerald-700 font-bold">Multiplicador {yieldRatio}x</span>
              </div>
              <div className="space-y-0.5 border-l border-gray-100 pl-3">
                <span className="text-[10px] uppercase font-bold text-gray-500">Tiempo Preparación</span>
                <div className="text-base font-extrabold text-brand-primary">3 Minutos</div>
                <span className="text-[10px] text-gray-400">Agua caliente 85 °C</span>
              </div>
              <div className="space-y-0.5 border-l border-gray-100 pl-3">
                <span className="text-[10px] uppercase font-bold text-gray-500">Vida Útil</span>
                <div className="text-base font-extrabold text-brand-primary">25 Años</div>
                <span className="text-[10px] text-gray-400">Sin refrigeración</span>
              </div>
            </div>

            {/* Caja de Precio y Beneficios según Rol */}
            <div className="bg-white border border-brand-primary/15 rounded-brand-2xl p-5 space-y-4 shadow-sm">
              {currentRole === 'CONSUMER_WHOLESALE' ? (
                /* Vista Mayorista (B2B) */
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-emerald-800">
                          S/ {wholesalePricePerUnit.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          S/ {product.publicPricePen.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Tarifa Mayorista B2B
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-muted mt-1">
                        Caja Máster de {product.wholesaleMoqUnits} unidades:{' '}
                        <strong className="text-brand-primary font-black">S/ {wholesaleBoxPrice.toFixed(2)}</strong> (incluye IGV)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <div className="flex items-center border border-gray-300 rounded-brand-md overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 text-xs font-bold text-brand-primary min-w-[50px] text-center">
                        {quantity} {quantity === 1 ? 'Caja' : 'Cajas'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-4 rounded-brand-md bg-brand-secondary-dark hover:bg-emerald-800 text-white font-extrabold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <Box className="w-4 h-4" />
                      <span>
                        Añadir {quantity * product.wholesaleMoqUnits} Pouches al Carrito (S/{' '}
                        {(wholesaleBoxPrice * quantity).toFixed(2)})
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Vista Minorista (B2C) */
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      {isGold ? (
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black text-amber-950">
                            S/ {unitPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            S/ {product.publicPricePen.toFixed(2)}
                          </span>
                          <span className="text-xs font-extrabold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            -10% Descuento Plan Oro
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black text-brand-primary">
                            S/ {unitPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">por pouch sellado</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                        <span>Stock disponible en Lima: <strong>{product.stockInLima} unidades</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Despacho en 24-48 h</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>+{filipuntosEarned * quantity} Filipuntos</span>
                      </div>
                      {isGold && savingsPerUnit > 0 && (
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">
                          Ahorras S/ {(savingsPerUnit * quantity).toFixed(2)} en este pedido
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selector de Cantidad y Botón de Compra */}
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="flex items-center border border-gray-300 rounded-brand-md overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2.5 text-xs font-bold text-brand-primary min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Añadir {quantity} {quantity === 1 ? 'Pouch' : 'Pouches'} al Carrito • S/{' '}
                        {(unitPrice * quantity).toFixed(2)}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Alerta de añadido exitoso */}
              {addedAlert && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-brand-md p-3 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Producto añadido al carrito. Puedes revisar tu pedido en cualquier momento en el icono del carrito superior.
                  </span>
                </div>
              )}
            </div>

            {/* Políticas de Logística y Envío */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-2.5 p-3 rounded-brand-lg bg-white border border-gray-200">
                <Truck className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-brand-primary font-bold">Despacho Courier en Lima</strong>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Envío seguro en empaque rígido anti-impacto. Flete estándar S/ 10 o gratis con Plan Oro.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-brand-lg bg-white border border-gray-200">
                <RotateCcw className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-brand-primary font-bold">Reembolso sin Trámites</strong>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Garantía de reposición inmediata en ALTOQ Créditos ante cualquier rotura de empaque.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Pestañas de Contenido Detallado: Descripción, Ficha Técnica y Reseñas */}
        <div id="seccion-reseñas" className="bg-white border border-brand-primary/10 rounded-brand-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Cabecera de Pestañas */}
          <div className="flex items-center space-x-4 border-b border-gray-200 pb-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('descripcion')}
              className={`pb-2 px-1 text-sm font-extrabold transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === 'descripcion'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-brand-primary'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Descripción e Historia</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tecnica')}
              className={`pb-2 px-1 text-sm font-extrabold transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === 'tecnica'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-brand-primary'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ficha Técnica y Preparación</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reseñas')}
              className={`pb-2 px-1 text-sm font-extrabold transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === 'reseñas'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-brand-primary'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reseñas de Clientes ({currentReviewsCount})</span>
            </button>
          </div>

          {/* Pestaña 1: Descripción e Historia */}
          {activeTab === 'descripcion' && (
            <div className="space-y-6 text-sm text-brand-text-main leading-relaxed animate-fadeIn">
              <div>
                <h3 className="text-base font-extrabold text-brand-primary mb-2">
                  Origen y Tradición Gastronómica
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.culturalContext}
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Este alimento representa el trabajo coordinado de <strong>{product.producerName}</strong> en la región de <strong>{product.originRegion}</strong>. Elaborado bajo estándares de comercio justo y respeto por las recetas ancestrales peruanas, promoviendo la sostenibilidad agraria andina y amazónica.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="p-4 rounded-brand-xl bg-brand-surface-soft/60 border border-brand-primary/10 space-y-2">
                  <h4 className="font-extrabold text-brand-primary text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-brand-secondary" />
                    <span>Ventaja de la Liofilización ALTOQ</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A diferencia del deshidratado al calor que destruye vitaminas y altera la textura, la liofilización congela el alimento a -40 °C y sublima el hielo en vacío directo a vapor. La estructura celular permanece 100% intacta, permitiendo una rehidratación perfecta en solo 3 minutos.
                  </p>
                </div>

                <div className="p-4 rounded-brand-xl bg-brand-surface-soft/60 border border-brand-primary/10 space-y-2">
                  <h4 className="font-extrabold text-brand-primary text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Pureza y Seguridad Alimentaria</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    0 conservantes artificiales ni aditivos químicos. Gracias a la ausencia casi total de agua libre (actividad de agua aw menor a 0.2), el alimento no permite la proliferación de bacterias u hongos, manteniendo su inocuidad por décadas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña 2: Ficha Técnica y Preparación */}
          {activeTab === 'tecnica' && (
            <div className="space-y-6 text-sm text-brand-text-main animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-brand-primary">Ingredientes y Alérgenos</h3>
                  <div className="p-4 rounded-brand-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-gray-700">Ingredientes declarados: </span>
                      <span className="text-gray-600">{product.ingredients}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Alérgenos: </span>
                      <span className="text-gray-600">
                        {product.allergens && product.allergens.length > 0
                          ? product.allergens.join(', ')
                          : 'No contiene alérgenos comunes'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Barrera del Empaque: </span>
                      <span className="text-gray-600">{product.packagingBarrierType}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Código Registro DIGESA: </span>
                      <span className="font-mono text-brand-primary font-bold">{product.digesaCode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-brand-primary">Instrucciones de Preparación</h3>
                  <div className="p-4 rounded-brand-xl bg-brand-surface-soft/50 border border-brand-primary/10 text-xs space-y-2.5">
                    <div className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        1
                      </span>
                      <span>Abre el pouch rasgando la muesca superior o vierte el contenido en un tazón hondo.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        2
                      </span>
                      <span>
                        Añade 300 a 350 ml de agua hirviendo o muy caliente (85-90 °C) según la consistencia deseada.
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        3
                      </span>
                      <span>Tapa o cierra el cierre hermético, deja reposar durante 3 minutos, revuelve bien y sirve.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video de Receta Express si está disponible */}
              {product.youtubeRecipeUrl && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
                    <span>Video de Preparación Express (3 minutos)</span>
                  </h3>
                  <div className="max-w-2xl mx-auto">
                    <YoutubeRecipeEmbed
                      videoIdOrUrl={product.youtubeRecipeUrl}
                      recipeTitle={product.commercialName}
                      prepTimeMinutes={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pestaña 3: Reseñas y Calificaciones de Clientes */}
          {activeTab === 'reseñas' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Notificación de reseña guardada con éxito */}
              {reviewSuccessMessage && (
                <div className="p-4 rounded-brand-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>
                    Tu reseña fue publicada exitosamente con la insignia de Compra Verificada. ¡Gracias por compartir tu experiencia con la comunidad ALTOQ!
                  </span>
                </div>
              )}

              {/* Resumen Superior de Calificaciones */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-brand-xl bg-gray-50 border border-gray-200">
                {/* Puntuación Promedio (4 Cols) */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                  <div className="text-5xl font-black text-brand-primary">
                    {currentRating.toFixed(1)}
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(currentRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Basado en {currentReviewsCount} reseñas verificadas
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    100% de compradores lo recomiendan
                  </div>
                </div>

                {/* Barras de Distribución de Estrellas (5 Cols) */}
                <div className="md:col-span-5 space-y-2 justify-center flex flex-col">
                  {starCounts.map((item) => (
                    <div key={item.stars} className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-gray-700 w-12">{item.stars} estrellas</span>
                      <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 w-9 text-right font-mono">
                        {Math.round(item.percentage)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón de Publicar Reseña (3 Cols) */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-xs text-gray-600 font-medium">
                    ¿Has probado este plato liofilizado?
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                    className="w-full py-2.5 px-4 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-extrabold text-xs transition-colors shadow-sm"
                  >
                    {showReviewForm ? 'Cancelar' : 'Escribir una Reseña'}
                  </button>
                </div>
              </div>

              {/* Formulario Interactivo para Nueva Reseña */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-6 rounded-brand-xl bg-white border-2 border-brand-primary/20 space-y-4 shadow-sm animate-fadeIn"
                >
                  <h4 className="font-extrabold text-brand-primary text-base">
                    Califica tu experiencia con {product.commercialName}
                  </h4>

                  {/* Selector de Estrellas */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Puntuación general:</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">
                        {newRating === 5 ? 'Excelente' : newRating === 4 ? 'Muy bueno' : newRating === 3 ? 'Regular' : 'Mejorable'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">Tu Nombre:</label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder={currentUser?.firstName || 'Ej. Carlos Mendoza'}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">Título de la Reseña:</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej. Sabor casero idéntico y muy práctico"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Comentario y Experiencia:</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Comparte cómo fue el sabor, la textura de la carne/vegetales al rehidratar con agua caliente en 3 minutos..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-extrabold text-xs transition-colors shadow-xs"
                    >
                      Publicar Reseña Verificada
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Reseñas de Clientes */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-brand-primary">
                  Opiniones de la comunidad ({currentReviews.length})
                </h4>

                {currentReviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-6 text-center">
                    Aún no hay reseñas para este alimento. ¡Sé el primero en calificarlo!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {currentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-5 rounded-brand-xl bg-white border border-gray-200/80 space-y-2 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-black text-xs flex items-center justify-center">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-xs text-brand-primary">
                                  {review.userName}
                                </span>
                                {review.userRole && (
                                  <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                    {review.userRole}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1.5 text-[11px] text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{review.date}</span>
                              </div>
                            </div>
                          </div>

                          {review.verifiedPurchase && (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Compra Verificada en ALTOQ</span>
                            </span>
                          )}
                        </div>

                        {/* Estrellas y Título */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <h5 className="font-extrabold text-xs text-brand-primary">
                            {review.title}
                          </h5>
                        </div>

                        {/* Comentario */}
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. Alimentos Liofilizados Relacionados */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-brand-primary">
              Otros alimentos liofilizados recomendados
            </h3>
            <Link
              href="/"
              className="text-xs font-bold text-brand-secondary hover:underline flex items-center space-x-1"
            >
              <span>Ver catálogo completo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {approvedProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/producto/${related.id}`}
                  className="bg-white border border-gray-200 rounded-brand-xl p-4 hover:border-brand-primary/40 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 flex items-center justify-center p-2 mb-2 bg-brand-surface-soft/40 rounded-brand-lg overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={related.packagingPhotoUrl}
                        alt={related.commercialName}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-brand-secondary-dark uppercase">
                      {related.originRegion}
                    </div>
                    <h4 className="font-extrabold text-xs text-brand-primary line-clamp-2 mt-0.5">
                      {related.commercialName}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-black text-sm text-brand-primary">
                      S/ {related.publicPricePen.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-brand-secondary font-bold group-hover:underline">
                      Ver detalle &rarr;
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      {/* Modales Compartidos de la Plataforma */}
      <CartDrawer />
      <OrdersModal />
      <QuoteModal />
      <ProducerProductModal />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <MarketplaceProvider>
      <ProductDetailContent />
    </MarketplaceProvider>
  );
}
