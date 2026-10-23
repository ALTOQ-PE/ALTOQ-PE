'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/components/marketplace/MarketplaceContext';
import type { CatalogProduct, ProductCategory } from '@/types';
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck,
  Sparkles,
  Scale,
  Clock,
  DollarSign,
  Info,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_POUCH_PHOTOS = [
  { label: 'Pouch Tricapa Ají de Gallina', url: '/assets/products/pouches-pack.png' },
  { label: 'Pouch Degustación Andino', url: '/assets/products/bowls-freeze-dried.png' },
  { label: 'Caja Máster Despacho', url: '/assets/products/box-delivery.png' },
];

export default function NuevoProductoPage() {
  const router = useRouter();
  const { addProduct, currentUser } = useMarketplace();

  // 1. Datos Generales
  const [commercialName, setCommercialName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('PLATO_TIPICO_LIOFILIZADO');
  const [originRegion, setOriginRegion] = useState(currentUser?.originRegion || 'Cusco');
  const [culturalContext, setCulturalContext] = useState('');

  // 2. Especificaciones de Rendimiento
  const [netWeightGrams, setNetWeightGrams] = useState(45);
  const [rehydratedYieldGrams, setRehydratedYieldGrams] = useState(380);
  const [ingredients, setIngredients] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [prepSteps, setPrepSteps] = useState(
    '1. Abre el pouch rasgando la muesca superior. 2. Añade 300 ml de agua hirviendo (85-90 °C). 3. Tapa, espera 3 minutos, revuelve y sirve.'
  );

  // 3. Control Sanitario DIGESA y Octógonos (Ley 30021)
  const [digesaCode, setDigesaCode] = useState(currentUser?.digesaRegistryCode || 'RSA-P2409821-LIMA');
  const [octagonCount, setOctagonCount] = useState<number>(0);
  const [octagonTypes, setOctagonTypes] = useState<string[]>([]);
  const [affidavitAccepted, setAffidavitAccepted] = useState(false);

  // 4. Precios y Logística
  const [wholesaleCostPen, setWholesaleCostPen] = useState(12.50);
  const [publicPricePen, setPublicPricePen] = useState(22.50);
  const [wholesalePricePen, setWholesalePricePen] = useState(16.50);
  const [wholesaleMoqUnits, setWholesaleMoqUnits] = useState(24);
  const [initialStockLima, setInitialStockLima] = useState(48);

  // 5. Fotografía y Video
  const [packagingPhotoUrl, setPackagingPhotoUrl] = useState('/assets/products/pouches-pack.png');
  const [dishPhotoUrl, setDishPhotoUrl] = useState('/assets/products/bowls-freeze-dried.png');
  const [youtubeVideoId, setYoutubeVideoId] = useState('dQw4w9WgXcQ');

  // Estados de interfaz
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Ratio de rendimiento
  const yieldRatio = netWeightGrams > 0 ? (rehydratedYieldGrams / netWeightGrams).toFixed(1) : '1.0';

  const toggleAllergen = (item: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSelectOctagonCount = (count: number) => {
    setOctagonCount(count);
    if (count === 0) {
      setOctagonTypes([]);
    } else if (count === 1) {
      setOctagonTypes((prev) => (prev.length > 0 ? [prev[0]] : []));
    } else if (count === 2) {
      setOctagonTypes((prev) => prev.slice(0, 2));
    }
  };

  const toggleOctagonType = (item: string) => {
    if (octagonCount === 1) {
      // Si la cantidad declarada es 1:
      // Si ya está seleccionado, lo desmarca. Si es otro, selecciona exclusivamente el nuevo.
      setOctagonTypes((prev) => (prev.includes(item) ? [] : [item]));
      return;
    }

    if (octagonCount === 2) {
      setOctagonTypes((prev) => {
        if (prev.includes(item)) {
          return prev.filter((o) => o !== item);
        }
        if (prev.length >= 2) {
          return prev;
        }
        return [...prev, item];
      });
      return;
    }

    setOctagonTypes([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!commercialName.trim()) {
      setErrorMessage('Ingresa el nombre comercial del alimento liofilizado.');
      return;
    }

    if (!digesaCode.trim()) {
      setErrorMessage('El Registro Sanitario DIGESA (RSA) es obligatorio por ley.');
      return;
    }

    if (octagonCount > 2) {
      setErrorMessage('ALTOQ PE rechaza automáticamente alimentos con más de 2 octógonos (política estricta de salud).');
      return;
    }

    if (octagonCount === 1 && octagonTypes.length !== 1) {
      setErrorMessage('Has declarado 1 octógono. Selecciona cuál de los sellos aplica (Sodio, Azúcar o Grasas Saturadas).');
      return;
    }

    if (octagonCount === 2 && octagonTypes.length !== 2) {
      setErrorMessage(`Has declarado 2 octógonos. Debes seleccionar exactamente los 2 sellos aplicables (llevas ${octagonTypes.length} de 2).`);
      return;
    }

    if (!affidavitAccepted) {
      setErrorMessage('Debes aceptar la declaración jurada de cumplimiento sanitario y empaque tricapa.');
      return;
    }

    setIsSubmitting(true);

    const generatedSlug = commercialName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct: CatalogProduct = {
      id: `prod-${Date.now()}`,
      producerId: currentUser?.id || 'prod-custom-01',
      producerName: currentUser?.companyName || 'Cooperativa Valle Sagrado',
      originRegion,
      commercialName,
      slug: generatedSlug,
      category,
      isTrialPack: false,
      culturalContext: culturalContext || `Alimento liofilizado elaborado con materias primas de ${originRegion}, conservando su textura, sabor criollo y nutrientes gracias al proceso de sublimación a -40 °C.`,
      ingredients: ingredients || 'Ingredientes 100% naturales seleccionados sin preservantes artificiales.',
      netWeightGrams: Number(netWeightGrams),
      rehydratedYieldGrams: Number(rehydratedYieldGrams),
      allergens: selectedAllergens,
      prepSteps,
      packagingPhotoUrl: packagingPhotoUrl || '/assets/products/pouches-pack.png',
      dishPhotoUrl: dishPhotoUrl || '/assets/products/bowls-freeze-dried.png',
      youtubeRecipeUrl: youtubeVideoId || undefined,
      packagingBarrierType: 'Tricapa foil multicapa sellado hermético anti-humedad (>80% HR)',
      stockInLima: Number(initialStockLima),
      wholesaleCostPen: Number(wholesaleCostPen),
      publicPricePen: Number(publicPricePen),
      wholesalePricePen: Number(wholesalePricePen),
      wholesaleMoqUnits: Number(wholesaleMoqUnits),
      isExclusiveGold: false,
      commissionPercentage: 15.0,
      digesaCode,
      qualityCertificatesUrls: ['https://example.com/certificado-digesa.pdf'],
      octagonCount: Number(octagonCount),
      octagonTypes: octagonCount === 0 ? [] : (octagonTypes as any),
      healthPolicyAccepted: true,
      rating: 5.0,
      reviewCount: 1,
      galleryPhotos: [
        packagingPhotoUrl || '/assets/products/pouches-pack.png',
        dishPhotoUrl || '/assets/products/bowls-freeze-dried.png'
      ],
      reviews: [
        {
          id: `rev-initial-${Date.now()}`,
          userName: 'Curaduría Bromatológica ALTOQ',
          userRole: 'Control de Calidad Lima',
          rating: 5,
          title: 'Lote validado para despacho en Lima',
          comment: 'Producto inspeccionado en acopio seco. Sellado tricapa conforme y rehidratación en 3 minutos comprobada.',
          date: '23 de Octubre de 2026',
          verifiedPurchase: true
        }
      ]
    };

    // Agregar al catálogo general y a la lista del productor
    addProduct(newProduct);
    setSuccessMessage(true);

    setTimeout(() => {
      router.push('/producer');
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navegación y Encabezado */}
      <div>
        <Link
          href="/producer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Productos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
              Registrar Nuevo Alimento Liofilizado
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              Publica tu alimento terminado en el catálogo digital de ALTOQ PE para venta minorista y pedidos mayoristas B2B.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-brand-md text-xs font-bold text-emerald-900 flex items-center space-x-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Curaduría Sanitaria Activa</span>
          </div>
        </div>
      </div>

      {/* Alerta de Éxito al Registrar */}
      {successMessage && (
        <div className="p-5 rounded-brand-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-sm font-bold flex items-center space-x-3 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="text-base font-black">¡Alimento registrado exitosamente!</div>
            <div className="text-xs font-normal text-emerald-800 mt-0.5">
              El producto se ha incorporado a tu panel de inventario y al catálogo del marketplace. Redirigiendo a Mis Productos...
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Error de Validación */}
      {errorMessage && (
        <div className="p-4 rounded-brand-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario Principal de Publicación */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: Identificación Comercial */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
              <Package className="w-4 h-4 text-brand-secondary" />
              <span>1. Identificación Comercial del Producto</span>
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">
              Información visible para los compradores en la tienda y en fichas técnicas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Nombre Comercial del Alimento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="Ej. Ají de Gallina Liofilizado Tradicional (Pouch 45g)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Categoría de Alimento <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-medium"
              >
                <option value="PLATO_TIPICO_LIOFILIZADO">Plato Típico Liofilizado</option>
                <option value="FRUTA_LIOFILIZADA">Fruta Liofilizada</option>
                <option value="VERDURA_LIOFILIZADA">Verdura Liofilizada</option>
                <option value="SOPA_INSTANTANEA">Sopa Instantánea</option>
                <option value="SUPERFOOD_ANDINO">Superfood Andino</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Región de Origen <span className="text-red-500">*</span>
              </label>
              <select
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-medium"
              >
                <option value="Cusco">Cusco</option>
                <option value="Junín">Junín</option>
                <option value="Puno">Puno</option>
                <option value="Ayacucho">Ayacucho</option>
                <option value="Arequipa">Arequipa</option>
                <option value="San Martín">San Martín</option>
                <option value="La Libertad">La Libertad</option>
                <option value="Áncash">Áncash</option>
                <option value="Lima">Lima</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Historia, Origen y Contexto Cultural
              </label>
              <textarea
                rows={3}
                value={culturalContext}
                onChange={(e) => setCulturalContext(e.target.value)}
                placeholder="Describe cómo se produce el alimento, los ingredientes emblemáticos de tu región y las propiedades organolépticas tras rehidratarse..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Rendimiento y Preparación Express */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
              <Scale className="w-4 h-4 text-brand-secondary" />
              <span>2. Rendimiento Bromatológico y Preparación</span>
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">
              La liofilización rinde entre 6x y 10x al hidratarse con agua caliente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Peso Neto Seco (gramos)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={netWeightGrams}
                onChange={(e) => setNetWeightGrams(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Rendimiento Servido (gramos)
              </label>
              <input
                type="number"
                min="50"
                max="2000"
                value={rehydratedYieldGrams}
                onChange={(e) => setRehydratedYieldGrams(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Factor de Rendimiento
              </label>
              <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-brand-md text-emerald-900 font-extrabold text-sm flex items-center justify-between">
                <span>Rinde en plato:</span>
                <span className="text-base font-black">{yieldRatio}x</span>
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Ingredientes Completos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ej. Pechuga de gallina criolla, ají amarillo, leche evaporada, nueces, especias andinas."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Alérgenos Presentes (Declaración Obligatoria)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Lácteos', 'Nueces / Frutos Secos', 'Gluten', 'Soya', 'Huevos', 'Sin Alérgenos'].map((allg) => (
                  <button
                    key={allg}
                    type="button"
                    onClick={() => toggleAllergen(allg)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      selectedAllergens.includes(allg)
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {allg}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Instrucciones de Preparación Express (3 minutos)
              </label>
              <textarea
                rows={2}
                value={prepSteps}
                onChange={(e) => setPrepSteps(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: Control Sanitario DIGESA y Política de Salud */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Filtro Sanitario DIGESA y Política de Salud (Ley 30021)</span>
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">
              Política innegociable de ALTOQ PE: Solo se aceptan productos con máximo 2 octógonos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Código de Registro Sanitario DIGESA (RSA) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={digesaCode}
                onChange={(e) => setDigesaCode(e.target.value)}
                placeholder="Ej. RSA-P2409821-LIMA"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Cantidad de Octógonos (Máximo 2 permitidos) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectOctagonCount(num)}
                    className={`py-2 px-3 rounded-brand-md border text-xs font-bold transition-all text-center ${
                      octagonCount === num
                        ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {num === 0 ? '0 Octógonos' : `${num} Octógono${num > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {octagonCount > 0 && (
              <div className="sm:col-span-2 space-y-2 p-3.5 rounded-brand-md bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 block">
                    Selecciona los octógonos aplicables:
                  </label>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      octagonTypes.length === octagonCount
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {octagonTypes.length} de {octagonCount} seleccionado{octagonCount > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80">
                  {octagonCount === 1
                    ? 'Haz clic sobre el sello que corresponde a tu producto (solo puedes elegir 1).'
                    : 'Selecciona exactamente los 2 sellos que aplican a tu producto.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { id: 'ALTO_EN_SODIO', label: 'ALTO EN SODIO' },
                    { id: 'ALTO_EN_AZUCAR', label: 'ALTO EN AZÚCAR' },
                    { id: 'ALTO_EN_GRASAS_SATURADAS', label: 'ALTO EN GRASAS SATURADAS' },
                  ].map(({ id, label }) => {
                    const isSelected = octagonTypes.includes(id);
                    const isMaxReached = octagonCount === 2 && octagonTypes.length >= 2 && !isSelected;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleOctagonType(id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-sm ring-2 ring-black/20'
                            : isMaxReached
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                        title={isMaxReached ? 'Ya alcanzaste el límite de 2 octógonos declarados' : undefined}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#D85A2F]' : 'bg-gray-300'}`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Declaración Jurada */}
            <div className="sm:col-span-2 p-4 bg-emerald-50/60 border border-emerald-200 rounded-brand-lg space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={affidavitAccepted}
                  onChange={(e) => setAffidavitAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary h-4 w-4"
                />
                <span className="text-xs text-brand-primary leading-relaxed">
                  <strong>Declaración Jurada Sanitaria:</strong> Certifico que este lote de alimentos liofilizados cuenta con Registro Sanitario DIGESA vigente, cumple con el límite estricto de no más de 2 octógonos (Ley 30021), y utiliza empaque hermético tricapa con barrera anti-humedad para Lima (&gt;80% HR).
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: Precios y Stock Consignado */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-brand-accent" />
              <span>4. Estructura Comercial, Precios y Stock</span>
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">
              Define tu precio de liquidación ex-planta y los precios al público y mayorista.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Costo Productor Ex-Planta (S/) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">S/</span>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  required
                  value={wholesaleCostPen}
                  onChange={(e) => setWholesaleCostPen(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono font-bold"
                />
              </div>
              <span className="text-[10px] text-gray-500">Monto neto que recibes en liquidaciones quincenales</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Precio Sugerido Minorista (S/) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">S/</span>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  required
                  value={publicPricePen}
                  onChange={(e) => setPublicPricePen(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono font-bold"
                />
              </div>
              <span className="text-[10px] text-gray-500">Precio publicado al consumidor final en e-commerce</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Precio Mayorista por Unidad (S/)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">S/</span>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  required
                  value={wholesalePricePen}
                  onChange={(e) => setWholesalePricePen(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono font-bold"
                />
              </div>
              <span className="text-[10px] text-gray-500">Para compras por cajas de restaurantes y hoteles</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Unidades Mínimas por Caja (MOQ)
              </label>
              <input
                type="number"
                min="6"
                max="120"
                value={wholesaleMoqUnits}
                onChange={(e) => setWholesaleMoqUnits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Stock Inicial en Acopio Lima (u.)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={initialStockLima}
                onChange={(e) => setInitialStockLima(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Comisión Comercial ALTOQ
              </label>
              <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-brand-md text-gray-700 font-bold text-xs flex items-center justify-between">
                <span>Retención comercial:</span>
                <span className="font-mono text-brand-primary">15.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 5: Fotografía y Video */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-brand-secondary" />
              <span>5. Fotografías del Alimento y Video de Preparación</span>
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">
              Puedes seleccionar fotos oficiales de la biblioteca o ingresar rutas directas.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 block">
              Selecciona Foto Prediseñada de Pouch o Plato:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_POUCH_PHOTOS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setPackagingPhotoUrl(preset.url);
                  }}
                  className={`p-3 rounded-brand-md border text-left flex items-center space-x-3 transition-all ${
                    packagingPhotoUrl === preset.url
                      ? 'border-[#0F3D2E] bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 object-contain rounded bg-white p-1 border border-gray-100"
                  />
                  <div className="text-xs font-bold text-brand-primary leading-tight">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Ruta de Foto Pouch
                </label>
                <input
                  type="text"
                  value={packagingPhotoUrl}
                  onChange={(e) => setPackagingPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Video YouTube ID (Receta Express 3 min)
                </label>
                <input
                  type="text"
                  value={youtubeVideoId}
                  onChange={(e) => setYoutubeVideoId(e.target.value)}
                  placeholder="Ej. dQw4w9WgXcQ"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-brand-md focus:outline-none focus:border-brand-primary bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Envío */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
          <Link
            href="/producer"
            className="w-full sm:w-auto px-6 py-3 rounded-brand-md border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors text-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSubmitting ? 'Validando y Publicando...' : 'Publicar Alimento en Catálogo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
