import React from 'react';
import { ProductCard } from '@/components/landing/ProductCard';
import { YoutubeRecipeEmbed } from '@/components/landing/YoutubeRecipeEmbed';
import type { CatalogProduct } from '@/types';
import { Sparkles, ShieldCheck, Flame, CheckCircle2, Clock, Truck } from 'lucide-react';

// Productos de muestra con estricto apego a las reglas de negocio
const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-001',
    producerId: 'prod-agro-01',
    producerName: 'Agroindustrias del Valle Sagrado',
    originRegion: 'Cusco',
    commercialName: 'Ají de Gallina Liofilizado Tradicional',
    slug: 'aji-de-gallina-liofilizado-cusco',
    category: 'PLATO_TIPICO_LIOFILIZADO',
    isTrialPack: false,
    culturalContext:
      'Receta tradicional cusqueña elaborada con pechuga deshilachada, ají amarillo criollo y caldo concentrado. Liofilizada a -40 °C conservando el 97% de nutrientes y sabor original.',
    ingredients: 'Pechuga de gallina criolla, ají amarillo, leche evaporada, nueces, especias andinas.',
    netWeightGrams: 45,
    rehydratedYieldGrams: 380, // Rendimiento ~8.4x
    allergens: ['Lácteos', 'Nueces'],
    prepSteps: '1. Abre el pouch tricapa. 2. Añade 300 ml de agua caliente (85-90 °C). 3. Tapa, espera 3 minutos y sirve.',
    packagingPhotoUrl: '/products/aji-gallina-pouch.png',
    dishPhotoUrl: '/products/aji-gallina-plato.png',
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Tricapa foil multicapa sellado hermético anti-humedad (>80% HR)',
    stockInLima: 48,
    wholesaleCostPen: 12.0,
    publicPricePen: 22.5,
    wholesalePricePen: 16.5,
    wholesaleMoqUnits: 12,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-P2409821-LIMA',
    qualityCertificatesUrls: ['https://example.com/haccp-cert.pdf'],
    octagonCount: 1, // <= 2 octógonos
    octagonTypes: ['ALTO_EN_SODIO'],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-002',
    producerId: 'prod-agro-02',
    producerName: 'BioAlimentos de Junín',
    originRegion: 'Junín',
    commercialName: 'Sopa Criolla Liofilizada con Carne Mechada',
    slug: 'sopa-criolla-liofilizada-junin',
    category: 'SOPA_INSTANTANEA',
    isTrialPack: false,
    culturalContext:
      'Clásica sopa reconfortante de la sierra central con fideos cabello de ángel, carne de res y aderezo de ají panca secado al sol.',
    ingredients: 'Carne vacuna mechada, fideos fortificados, ají panca, leche, orégano de Tarma.',
    netWeightGrams: 50,
    rehydratedYieldGrams: 420,
    allergens: ['Gluten', 'Lácteos'],
    prepSteps: 'Vierte 350 ml de agua hirviendo directo al pouch o tazón. Reposa 3 minutos y revuelve suavemente.',
    packagingPhotoUrl: '/products/sopa-criolla-pouch.png',
    dishPhotoUrl: '/products/sopa-criolla-plato.png',
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Tricapa metalizada con barrera de vapor de agua < 0.1 g/m2/día',
    stockInLima: 35,
    wholesaleCostPen: 10.5,
    publicPricePen: 19.9,
    wholesalePricePen: 14.5,
    wholesaleMoqUnits: 12,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-N8923019-DIGESA',
    qualityCertificatesUrls: ['https://example.com/bpm-junin.pdf'],
    octagonCount: 0, // 0 octógonos: 100% natural
    octagonTypes: [],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-003',
    producerId: 'prod-agro-03',
    producerName: 'Cooperativa Alto Andina Puno',
    originRegion: 'Puno',
    commercialName: 'Pack Degustación 4 Sabores del Altiplano',
    slug: 'pack-degustacion-liofilizados-puno',
    category: 'PACK_PRUEBA',
    isTrialPack: true,
    culturalContext:
      'Selección de 4 porciones individuales de liofilizados altoandinos para probar la tecnología de hidratación instantánea por primera vez.',
    ingredients: 'Peshque de quinua, crema de habas tostadas, charqui deshebrado y frutos secos.',
    netWeightGrams: 160,
    rehydratedYieldGrams: 900,
    allergens: [],
    prepSteps: 'Elige la porción deseada e hidrata con agua caliente en solo 3 minutos.',
    packagingPhotoUrl: '/products/pack-degustacion-pouch.png',
    dishPhotoUrl: '/products/pack-degustacion-plato.png',
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Empaque rígido alveolar secundario anti-impacto y hermético',
    stockInLima: 62,
    wholesaleCostPen: 25.0,
    publicPricePen: 44.9,
    wholesalePricePen: 35.0,
    wholesaleMoqUnits: 6,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-H1029384-PUNO',
    qualityCertificatesUrls: ['https://example.com/haccp-puno.pdf'],
    octagonCount: 0,
    octagonTypes: [],
    healthPolicyAccepted: true,
  },
];

export default function RetailConsumerPage() {
  return (
    <div className="space-y-10">
      {/* 1. Banner de Estado de Pedido Activo (Trazabilidad en 4 Etapas) */}
      <section className="bg-white border border-brand-primary/10 rounded-brand-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Pedido en curso
              </span>
              <span className="text-xs text-brand-text-muted font-mono">#ALTOQ-2026-0042</span>
            </div>
            <h2 className="text-base font-bold text-brand-primary mt-1">
              Despacho Protegido contra la Humedad de Lima
            </h2>
          </div>
          <div className="text-xs text-brand-text-muted">
            Estimado de entrega en Miraflores: <strong className="text-brand-primary">Hoy entre 4:00 pm y 6:30 pm</strong>
          </div>
        </div>

        {/* Barra de Progreso en 4 Pasos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-2">
          <div className="flex items-center space-x-2.5 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>1. Pago Validado</span>
          </div>
          <div className="flex items-center space-x-2.5 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>2. Acopio Seco Lima</span>
          </div>
          <div className="flex items-center space-x-2.5 text-brand-accent font-bold text-xs animate-pulse">
            <Truck className="w-5 h-5 text-brand-accent flex-shrink-0" />
            <span>3. En Ruta con Courier</span>
          </div>
          <div className="flex items-center space-x-2.5 text-gray-400 font-medium text-xs">
            <Clock className="w-5 h-5 text-gray-300 flex-shrink-0" />
            <span>4. Entregado</span>
          </div>
        </div>
      </section>

      {/* 2. Cabecera del Catálogo y Filtros de Salud */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary-dark">
              Nutrición Limpia y Sabores Andinos
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary mt-1">
              Catálogo de Alimentos Liofilizados
            </h1>
            <p className="text-sm text-brand-text-muted mt-1 max-w-2xl">
              Platos típicos e instantáneos elaborados por productores peruanos. Máximo 2 octógonos garantizados, listos en 3 minutos con agua caliente.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-brand-primary bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Política de Salud: 100% de productos con &le; 2 Octógonos</span>
          </div>
        </div>

        {/* Pestañas de Filtro */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-brand-primary text-white shadow-sm">
            Todos los Alimentos
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-white text-brand-text-muted border border-brand-primary/10 hover:border-brand-primary transition-colors">
            Packs de Degustación
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-white text-brand-text-muted border border-brand-primary/10 hover:border-brand-primary transition-colors">
            Platos Típicos Peruanos
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-white text-brand-text-muted border border-brand-primary/10 hover:border-brand-primary transition-colors">
            Sopas Reconfortantes
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-bold bg-white text-brand-secondary-dark border border-brand-secondary/30 hover:bg-brand-secondary/10 transition-colors">
            0 Octógonos • 100% Natural
          </button>
        </div>
      </div>

      {/* 3. Rejilla de Productos con Compra Informada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 4. Sección de Recetas Express en Video (3 Minutos) */}
      <section className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Beneficio Exclusivo Plan Oro</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-primary">
              Recetas Express en Video: Almuerzos en 3 Minutos
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1 max-w-2xl">
              Aprende a emplatar tus liofilizados como un chef: temperaturas de agua óptimas, guarniciones recomendadas y conservación de texturas crujientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-primary">
              Video Tutorial: Rehidratación Perfecta de Ají de Gallina
            </h3>
            <YoutubeRecipeEmbed
              videoIdOrUrl="dQw4w9WgXcQ"
              recipeTitle="Preparación de Ají de Gallina Liofilizado en 3 minutos"
              prepTimeMinutes={3}
            />
          </div>

          <div className="flex flex-col justify-center space-y-4 bg-brand-bg/60 p-6 rounded-brand-lg border border-brand-primary/10">
            <h4 className="text-sm font-extrabold text-brand-primary">
              Secretos de la Liofilización Peruana
            </h4>
            <ul className="text-xs text-brand-text-muted space-y-2.5">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>Usa agua caliente a 85 °C para conservar las notas frescas del ají amarillo.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>Respeta los 3 minutos de reposo con el pouch cerrado para que la carne recupere su fibra.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>Gana <strong>20 Filipuntos extra</strong> por cada reseña con foto de tu plato rehidratado.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
