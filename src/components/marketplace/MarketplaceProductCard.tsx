'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { CatalogProduct } from '@/types';
import { useMarketplace } from './MarketplaceContext';
import { DigesaCertificateViewer } from '../landing/DigesaCertificateViewer';
import { YoutubeRecipeEmbed } from '../landing/YoutubeRecipeEmbed';
import {
  ShieldCheck,
  Award,
  Clock,
  Box,
  FileDown,
  ShoppingCart,
  Video,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Building2,
  Package,
  Activity,
  Star,
  ExternalLink
} from 'lucide-react';

interface Props {
  product: CatalogProduct;
}

export const MarketplaceProductCard: React.FC<Props> = ({ product }) => {
  const { currentRole, addToCart, consumerPlan, toggleProductApproval } = useMarketplace();
  const [isDigesaModalOpen, setIsDigesaModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Rendimiento peso seco vs rehidratado
  const yieldRatio = (product.rehydratedYieldGrams / product.netWeightGrams).toFixed(1);

  // Precios mayoristas calculados
  const wholesalePricePerUnit = product.wholesalePricePen || product.publicPricePen * 0.75;
  const wholesaleBoxPrice = wholesalePricePerUnit * product.wholesaleMoqUnits;

  const currentRating = product.rating || 4.9;
  const currentReviewsCount = product.reviewCount || product.reviews?.length || 120;

  return (
    <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-4 sm:p-5 flex flex-col justify-between hover:border-brand-primary/30 hover:shadow-md transition-all relative group">
      {/* 1. Barra Superior de Estado según Rol */}
      {currentRole === 'PRODUCER' && (
        <div className="mb-3 px-3 py-1 bg-amber-50 border border-amber-200 rounded-brand-sm text-[11px] font-bold text-amber-900 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Package className="w-3.5 h-3.5 text-amber-700" />
            <span>Tu Producto en Lima: {product.stockInLima} u.</span>
          </span>
          <span className="text-gray-500 font-mono text-[10px]">Costo: S/ {product.wholesaleCostPen.toFixed(2)}</span>
        </div>
      )}

      {currentRole === 'SUPERADMIN' && (
        <div className="mb-3 px-3 py-1 bg-gray-900 text-white rounded-brand-sm text-[11px] font-bold flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Curaduría Sanitaria: {product.healthPolicyAccepted ? 'Aprobado' : 'Revisión'}</span>
          </span>
          <button
            type="button"
            onClick={() => toggleProductApproval(product.id)}
            className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {product.healthPolicyAccepted ? 'Pausar' : 'Aprobar'}
          </button>
        </div>
      )}

      {/* 2. Cabecera con Octógonos y Origen */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Badge de Octógonos (Ley 30021) */}
          <div>
            {product.octagonCount === 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                0 Octógonos • 100% Natural
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black text-white">
                {product.octagonCount} {product.octagonCount === 1 ? 'Octógono' : 'Octógonos'}
              </span>
            )}
          </div>

          {/* Botón Certificado DIGESA */}
          <button
            type="button"
            onClick={() => setIsDigesaModalOpen(true)}
            className="text-[10px] font-mono text-brand-primary hover:underline font-bold"
            title="Ver Certificado Sanitario DIGESA"
          >
            {product.digesaCode}
          </button>
        </div>

        {/* Imagen del Producto con enlace al detalle */}
        <Link
          href={`/producto/${product.id}`}
          className="h-44 flex items-center justify-center p-2 mb-3 bg-brand-surface-soft/40 rounded-brand-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 cursor-pointer block"
        >
          <img
            src={product.packagingPhotoUrl}
            alt={product.commercialName}
            className="max-h-full max-w-full object-contain filter drop-shadow-md"
          />
        </Link>

        {/* Datos Principales */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-brand-secondary-dark uppercase tracking-wider">
            {product.producerName} • {product.originRegion}
          </div>

          <h3 className="font-extrabold text-sm sm:text-base text-brand-primary leading-snug line-clamp-2">
            <Link href={`/producto/${product.id}`} className="hover:text-brand-secondary transition-colors">
              {product.commercialName}
            </Link>
          </h3>

          {/* Estrellas y Calificación */}
          <div className="flex items-center space-x-1.5">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(currentRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-brand-primary">
              {currentRating.toFixed(1)}
            </span>
            <Link
              href={`/producto/${product.id}#reseñas`}
              className="text-[11px] text-gray-500 hover:text-brand-primary hover:underline"
            >
              ({currentReviewsCount} reseñas)
            </Link>
          </div>

          <p className="text-[11px] text-brand-text-muted line-clamp-2 leading-relaxed">
            {product.culturalContext}
          </p>
        </div>

        {/* Barra de Rendimiento Liofilizado (Seco vs Servido) */}
        <div className="mt-3 py-2 px-2.5 bg-brand-bg rounded-brand-sm text-[11px] text-brand-text-main flex items-center justify-between border border-brand-primary/10">
          <div>
            <span className="text-gray-500">Pouch seco: </span>
            <strong className="text-brand-primary font-bold">{product.netWeightGrams} g</strong>
          </div>
          <span className="text-brand-secondary font-black">&rarr;</span>
          <div>
            <span className="text-gray-500">Rinde en plato: </span>
            <strong className="text-emerald-800 font-extrabold">{product.rehydratedYieldGrams} g ({yieldRatio}x)</strong>
          </div>
        </div>
      </div>

      {/* 3. Precios y Acciones Adaptativos según Rol */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        {/* Caso A: Consumidor Minorista (B2C) */}
        {currentRole === 'CONSUMER_RETAIL' && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                {consumerPlan === 'PLAN_ORO' ? (
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-xl font-black text-amber-950">
                      S/ {(product.publicPricePen * 0.9).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      S/ {product.publicPricePen.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      -10% Oro
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl font-black text-brand-primary">
                      S/ {product.publicPricePen.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-1">por pouch</span>
                  </div>
                )}
              </div>

              {consumerPlan === 'PLAN_ORO' ? (
                <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>+{Math.round(product.publicPricePen)} Filipuntos</span>
                </div>
              ) : (
                <span className="text-[10px] font-medium text-gray-400">
                  Plan Gratuito
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => addToCart(product, 1, false)}
                className="flex-1 py-2.5 px-3 rounded-brand-md bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-light transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </button>

              {consumerPlan === 'PLAN_ORO' && product.youtubeRecipeUrl ? (
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="p-2.5 rounded-brand-md bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                  title="Ver Receta Express en Video (3 min)"
                >
                  <Video className="w-4 h-4 text-amber-800" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => alert('Las recetas express en video de 3 minutos son exclusivas para miembros de Plan Oro.')}
                  className="p-2.5 rounded-brand-md bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Receta Express disponible en Plan Oro"
                >
                  <Video className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Caso B: Consumidor Mayorista (B2B) */}
        {currentRole === 'CONSUMER_WHOLESALE' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-emerald-800">
                  S/ {wholesalePricePerUnit.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  S/ {product.publicPricePen.toFixed(2)}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Mayorista Ex-Planta
                </span>
              </div>
              <div className="text-[11px] text-brand-text-muted mt-0.5">
                Caja máster x {product.wholesaleMoqUnits} pouches:{' '}
                <strong className="text-brand-primary font-bold">S/ {wholesaleBoxPrice.toFixed(2)}</strong> (con IGV)
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => addToCart(product, product.wholesaleMoqUnits, true)}
                className="flex-1 py-2.5 px-3 rounded-brand-md bg-brand-secondary-dark text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Box className="w-4 h-4" />
                <span>Añadir Caja x {product.wholesaleMoqUnits}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDigesaModalOpen(true)}
                className="p-2.5 rounded-brand-md border border-gray-300 hover:border-brand-primary text-gray-600 transition-colors"
                title="Descargar Ficha Técnica y Certificado Sanitario"
              >
                <FileDown className="w-4 h-4 text-brand-primary" />
              </button>
            </div>
          </div>
        )}

        {/* Caso C: Proveedor Agroindustrial */}
        {currentRole === 'PRODUCER' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">PVP en Tienda:</span>
              <strong className="text-brand-primary">S/ {product.publicPricePen.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Tu Retorno Ex-Planta:</span>
              <strong className="text-emerald-700 font-bold">S/ {product.wholesaleCostPen.toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="w-full py-2 rounded-brand-md border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors text-xs font-bold"
            >
              Gestionar Stock de Lote
            </button>
          </div>
        )}

        {/* Caso D: SuperAdmin */}
        {currentRole === 'SUPERADMIN' && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">PVP: S/ {product.publicPricePen.toFixed(2)}</span>
              <span className="text-emerald-700 font-bold">
                Margen MCu: S/ {(product.publicPricePen * 0.3).toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDigesaModalOpen(true)}
              className="w-full py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-[11px]"
            >
              Auditar Expediente DIGESA
            </button>
          </div>
        )}

        {/* Enlace directo a la ficha del producto */}
        <Link
          href={`/producto/${product.id}`}
          className="w-full mt-3 py-2 px-3 rounded-brand-md bg-brand-surface-soft hover:bg-[#E5ECE2] text-brand-primary text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-brand-primary/15"
        >
          <span>Ver Fotos, Descripción y Reseñas</span>
          <span className="text-brand-secondary font-black">&rarr;</span>
        </Link>
      </div>

      {/* Modal Interactivo de Certificado Sanitario DIGESA */}
      <div className="mt-2 text-right">
        <DigesaCertificateViewer
          digesaCode={product.digesaCode}
          producerName={product.producerName}
          productName={product.commercialName}
          packagingBarrierType={product.packagingBarrierType}
          qualityCertificatesUrls={product.qualityCertificatesUrls}
          originRegion={product.originRegion}
        />
      </div>

      {isVideoModalOpen && product.youtubeRecipeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-brand-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base text-brand-primary">
                Receta Express: {product.commercialName}
              </h4>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <YoutubeRecipeEmbed
              videoIdOrUrl={product.youtubeRecipeUrl}
              recipeTitle={product.commercialName}
              prepTimeMinutes={3}
            />
          </div>
        </div>
      )}
    </div>
  );
};
