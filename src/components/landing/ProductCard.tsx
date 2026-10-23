// ==============================================================================
// ALTOQ PE - COMPONENTE DE TARJETA DE PRODUCTO DE COMPRA INFORMADA
// Sello de Salud (<= 2 Octógonos), DIGESA, Historia Cultural y Rendimiento de Peso
// REGLA ESTRICTA: Sin uso de emojis en código ni contenido
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { OctagonBadge } from './OctagonBadge';
import { DigesaCertificateViewer } from './DigesaCertificateViewer';
import { YoutubeRecipeEmbed } from './YoutubeRecipeEmbed';

export interface ProductCardData {
  id: string;
  commercialName: string;
  slug: string;
  category: string;
  isTrialPack?: boolean;
  
  // Sanidad y Nutricion
  digesaCode: string;
  qualityCertificatesUrls?: string[];
  octagonCount: number;
  octagonTypes?: string[];

  // Contenido y Cultura
  culturalContext: string;
  originRegion: string;
  producerName: string;
  ingredients: string;

  // Equivalencias de Peso y Rendimiento
  netWeightGrams: number;
  rehydratedYieldGrams: number;

  // Multimedia
  packagingPhotoUrl: string;
  dishPhotoUrl: string;
  youtubeRecipeUrl?: string;

  // Comercial
  publicPricePen: number;
  stockInLima: number;
}

interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (product: ProductCardData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [showCulturalModal, setShowCulturalModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculo de factor de rendimiento (ej. 400g / 40g = 10x)
  const yieldMultiplier = Math.round(product.rehydratedYieldGrams / (product.netWeightGrams || 1));

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Insignias Superiores */}
        <div className="p-4 pb-0 flex items-start justify-between gap-2 z-10">
          <div className="flex flex-col gap-1.5 items-start">
            {/* Distintivo de Pack de Prueba o Categoria */}
            {product.isTrialPack ? (
              <span className="bg-[#D85A2F] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Pack de Degustación
              </span>
            ) : (
              <span className="bg-[#0F3D2E]/10 text-[#0F3D2E] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                {product.category.replace(/_/g, ' ')}
              </span>
            )}

            {/* Sello de Salud: 0, 1 o 2 Octogonos */}
            <OctagonBadge
              octagonCount={product.octagonCount}
              octagonTypes={product.octagonTypes}
              size="sm"
            />
          </div>

          {/* Sello de Origen Regional */}
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
            {product.originRegion}
          </span>
        </div>

        {/* Imagen del Producto con Transicion a Plato Servido en Hover */}
        <div className="relative h-48 w-full p-4 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => onQuickView?.(product)}>
          <img
            src={isHovered && product.dishPhotoUrl ? product.dishPhotoUrl : product.packagingPhotoUrl}
            alt={product.commercialName}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.dishPhotoUrl && (
            <span className="absolute bottom-1 right-3 text-[10px] text-neutral-400 bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
              {isHovered ? 'Plato servido' : 'Empaque sellado'}
            </span>
          )}
        </div>

        {/* Informacion Principal */}
        <div className="p-4 pt-1 flex-1 flex flex-col">
          <h3 className="font-extrabold text-base text-[#0F3D2E] group-hover:text-[#D85A2F] transition-colors leading-snug mb-1">
            {product.commercialName}
          </h3>

          <p className="text-xs text-neutral-500 mb-2 font-medium">
            Producido por <span className="text-neutral-700 font-semibold">{product.producerName}</span>
          </p>

          {/* Barra de Equivalencia de Peso y Rendimiento */}
          <div className="bg-[#F6F3EB] rounded-xl p-2.5 mb-3 border border-neutral-200/50">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F3D2E] mb-1">
              <span>Peso Seco: {product.netWeightGrams}g</span>
              <span className="text-[#D85A2F] font-black">Rinde {product.rehydratedYieldGrams}g ({yieldMultiplier}x)</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#8BAA52] h-1.5 rounded-full"
                style={{ width: `${Math.min(100, yieldMultiplier * 10)}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 flex justify-between">
              <span>Ultraligero en mochila</span>
              <span>Porción generosa en mesa</span>
            </div>
          </div>

          {/* Enlaces de Transparencia Sanitaria, Cultural y Video */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100 text-xs mb-3 flex-wrap">
            {/* Visor DIGESA */}
            <DigesaCertificateViewer
              productName={product.commercialName}
              producerName={product.producerName}
              digesaCode={product.digesaCode}
              qualityCertificatesUrls={product.qualityCertificatesUrls}
              originRegion={product.originRegion}
            />

            {/* Boton Historia Cultural */}
            <button
              type="button"
              onClick={() => setShowCulturalModal(true)}
              className="text-neutral-600 hover:text-[#0F3D2E] text-xs font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <span>Tradición</span>
            </button>

            {/* Boton Receta Express */}
            {product.youtubeRecipeUrl && (
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Receta</span>
              </button>
            )}
          </div>

          {/* Pie de Tarjeta: Precio y Accion de Compra */}
          <div className="mt-auto pt-2 flex items-center justify-between border-t border-neutral-100">
            <div>
              <span className="text-[11px] text-neutral-500 block leading-none font-medium">Precio Final</span>
              <span className="text-xl font-extrabold text-[#0F3D2E]">
                S/ {product.publicPricePen.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart?.(product.id)}
              className="bg-[#0F3D2E] hover:bg-[#D85A2F] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Historia Cultural y Tradicion */}
      {showCulturalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-3 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8BAA52]">
                  Identidad Gastronómica del Perú
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E]">{product.commercialName}</h3>
                <p className="text-xs text-neutral-500">Región de Origen: {product.originRegion}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCulturalModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm text-neutral-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-[#F6F3EB] p-3 rounded-xl border border-neutral-200/60">
                <h4 className="text-xs font-bold text-[#0F3D2E] uppercase mb-1">Contexto Cultural y Tradición</h4>
                <p className="text-xs text-neutral-700">{product.culturalContext}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0F3D2E] uppercase mb-1">Ingredientes de Origen</h4>
                <p className="text-xs text-neutral-600">{product.ingredients}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0F3D2E] uppercase mb-1">Productor Aliado</h4>
                <p className="text-xs text-neutral-600">
                  Elaborado por {product.producerName} en la región {product.originRegion}, mediante proceso de liofilización por sublimación al vacío que preserva más del 95% de nutrientes sin conservantes ni aditivos artificiales.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCulturalModal(false)}
                className="bg-[#0F3D2E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#144937]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Receta Express en YouTube */}
      {showVideoModal && product.youtubeRecipeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 mb-2">
              <h3 className="text-base font-bold text-[#0F3D2E]">Receta Express: {product.commercialName}</h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <YoutubeRecipeEmbed
              videoIdOrUrl={product.youtubeRecipeUrl}
              recipeTitle={product.commercialName}
            />

            <div className="mt-3 text-xs text-neutral-500 text-center">
              Rehidratación instantánea con agua caliente en solo 3 minutos.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
