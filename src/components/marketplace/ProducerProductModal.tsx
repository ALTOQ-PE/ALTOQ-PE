'use client';

import React, { useState } from 'react';
import { useMarketplace } from './MarketplaceContext';
import {
  Package,
  X,
  FileCheck,
  ShieldCheck,
  Plus,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { CatalogProduct, ProductCategory } from '@/types';

export const ProducerProductModal: React.FC = () => {
  const { isProducerModalOpen, setIsProducerModalOpen, addProduct, currentUser } = useMarketplace();

  const [commercialName, setCommercialName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('PLATO_TIPICO_LIOFILIZADO');
  const [originRegion, setOriginRegion] = useState(currentUser?.originRegion || 'Cusco');
  const [netWeightGrams, setNetWeightGrams] = useState(45);
  const [rehydratedYieldGrams, setRehydratedYieldGrams] = useState(380);
  const [ingredients, setIngredients] = useState('');
  const [digesaCode, setDigesaCode] = useState(currentUser?.digesaRegistryCode || 'RSA-P2409821-LIMA');
  const [octagonCount, setOctagonCount] = useState<number>(0);
  const [wholesaleCostPen, setWholesaleCostPen] = useState(12.5);
  const [publicPricePen, setPublicPricePen] = useState(22.0);
  const [wholesaleMoqUnits, setWholesaleMoqUnits] = useState(24);
  const [stockToConsign, setStockToConsign] = useState(48);
  const [affidavitAccepted, setAffidavitAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isProducerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!commercialName.trim()) {
      setErrorMessage('Ingresa el nombre comercial del alimento.');
      return;
    }
    if (!digesaCode.trim()) {
      setErrorMessage('El Registro Sanitario DIGESA es obligatorio.');
      return;
    }
    if (octagonCount > 2) {
      setErrorMessage('ALTOQ PE rechaza automáticamente alimentos con más de 2 octógonos (política estricta de salud).');
      return;
    }
    if (!affidavitAccepted) {
      setErrorMessage('Debes aceptar la declaración jurada de cumplimiento de máximo 2 octógonos.');
      return;
    }

    const newProd: CatalogProduct = {
      id: `prod-${Date.now()}`,
      producerId: currentUser?.id || 'prod-custom',
      producerName: currentUser?.companyName || 'Productor Agroindustrial Regional',
      originRegion,
      commercialName,
      slug: commercialName.toLowerCase().replace(/\s+/g, '-'),
      category,
      isTrialPack: false,
      culturalContext: `Plato típico liofilizado elaborado con insumos de ${originRegion}, conservando 97% de nutrientes y sabor original.`,
      ingredients: ingredients || 'Insumos 100% naturales seleccionados en origen.',
      netWeightGrams: Number(netWeightGrams) || 45,
      rehydratedYieldGrams: Number(rehydratedYieldGrams) || 380,
      allergens: [],
      prepSteps: 'Abre el pouch tricapa, vierte agua caliente a 85 °C hasta la marca, espera 3 minutos y sirve.',
      packagingPhotoUrl: '/assets/products/pouches-pack.png',
      dishPhotoUrl: '/assets/products/bowls-freeze-dried.png',
      youtubeRecipeUrl: 'dQw4w9WgXcQ',
      packagingBarrierType: 'Tricapa foil con barrera de vapor estricta (<0.1 g/m²/d)',
      stockInLima: Number(stockToConsign) || 48,
      wholesaleCostPen: Number(wholesaleCostPen) || 12.0,
      publicPricePen: Number(publicPricePen) || 22.0,
      wholesalePricePen: Number((wholesaleCostPen * 1.35).toFixed(2)),
      wholesaleMoqUnits: Number(wholesaleMoqUnits) || 24,
      isExclusiveGold: false,
      commissionPercentage: 15.0,
      digesaCode,
      qualityCertificatesUrls: ['/certs/haccp-codex.pdf'],
      octagonCount,
      octagonTypes: octagonCount === 1 ? ['ALTO_EN_SODIO'] : octagonCount === 2 ? ['ALTO_EN_SODIO', 'ALTO_EN_GRASAS_SATURADAS'] : [],
      healthPolicyAccepted: true,
    };

    addProduct(newProd);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setIsProducerModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsProducerModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-brand-xl shadow-2xl border border-brand-primary/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="bg-[#D85A2F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Package className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-extrabold text-base">
                Consignar Nuevo Producto en Acopio Lima
              </h3>
              <p className="text-[11px] text-orange-100">
                Verificación sanitaria de Registro DIGESA y límite estricto de &le; 2 octógonos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProducerModalOpen(false)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        {errorMessage && (
          <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="m-4 mb-0 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>¡Alimento liofilizado consignado y añadido al catálogo en Lima con éxito!</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Nombre comercial y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre Comercial del Alimento *</label>
              <input
                type="text"
                required
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="Ej. Seco de Cordero Liofilizado"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Categoría de Alimento *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none bg-white font-medium"
              >
                <option value="PLATO_TIPICO_LIOFILIZADO">Plato Típico Liofilizado</option>
                <option value="SOPA_INSTANTANEA">Sopa Criolla Instantánea</option>
                <option value="SNACK_LIOFILIZADO">Snack o Fruta Crujiente</option>
                <option value="PACK_PRUEBA">Pack Degustación</option>
              </select>
            </div>
          </div>

          {/* Región de Origen y Registro Sanitario DIGESA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Región de Origen *</label>
              <select
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none bg-white font-medium"
              >
                <option value="Cusco">Cusco</option>
                <option value="Junín">Junín</option>
                <option value="Puno">Puno</option>
                <option value="San Martín">San Martín</option>
                <option value="Ayacucho">Ayacucho</option>
                <option value="Áncash">Áncash</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Código de Registro Sanitario DIGESA *</label>
              <input
                type="text"
                required
                value={digesaCode}
                onChange={(e) => setDigesaCode(e.target.value)}
                placeholder="RSA-P2409821-LIMA"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Pesos e Ingredientes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Peso Neto Seco (gramos)</label>
              <input
                type="number"
                min="20"
                max="500"
                value={netWeightGrams}
                onChange={(e) => setNetWeightGrams(parseInt(e.target.value) || 45)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Rendimiento Rehidratado (gramos)</label>
              <input
                type="number"
                min="100"
                max="2000"
                value={rehydratedYieldGrams}
                onChange={(e) => setRehydratedYieldGrams(parseInt(e.target.value) || 380)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Ingredientes Principales *</label>
            <input
              type="text"
              required
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ej. Carne de cordero deshilachada, culantro, chicha de jora, frijoles canario, ají mirasol."
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-brand-primary focus:outline-none"
            />
          </div>

          {/* Conteo de Octógonos (Regla Estricta: Máximo 2) */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-brand-md space-y-2">
            <label className="block font-bold text-brand-primary">
              Conteo de Octógonos Nutricionales (Ley 30021) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setOctagonCount(num)}
                  className={`p-2 rounded border text-center font-bold transition-all ${
                    octagonCount === num
                      ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary ring-1 ring-[#0F3D2E]'
                      : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {num === 0 ? '0 Octógonos (Limpio)' : `${num} Octógono(s)`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400">
              Política ALTOQ PE: No se aceptan productos con 3 o más octógonos bajo ninguna circunstancia.
            </p>
          </div>

          {/* Precios y Stock de Consignación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Costo Ex-Planta (S/)</label>
              <input
                type="number"
                step="0.1"
                value={wholesaleCostPen}
                onChange={(e) => setWholesaleCostPen(parseFloat(e.target.value) || 12)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">PVP Sugerido (S/)</label>
              <input
                type="number"
                step="0.1"
                value={publicPricePen}
                onChange={(e) => setPublicPricePen(parseFloat(e.target.value) || 22)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Unidades en Lote</label>
              <input
                type="number"
                value={stockToConsign}
                onChange={(e) => setStockToConsign(parseInt(e.target.value) || 48)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
          </div>

          {/* Declaración Jurada */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-brand-md">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={affidavitAccepted}
                onChange={(e) => setAffidavitAccepted(e.target.checked)}
                className="mt-0.5 rounded border-orange-300 text-[#D85A2F] focus:ring-[#D85A2F]"
              />
              <span className="text-[11px] text-orange-950 leading-relaxed">
                <strong>Declaración Jurada Sanitaria: </strong>
                Certifico que este alimento liofilizado cuenta con Registro Sanitario DIGESA vigente, empaque tricapa foil anti-humedad para Lima (&gt;80% HR), y cumple estrictamente con el máximo de 2 octógonos de la política de ALTOQ PE.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#D85A2F] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#b84822] transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Consignar Alimento en Catálogo de ALTOQ PE</span>
          </button>
        </form>

        {/* Pie */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={() => setIsProducerModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-brand-md text-xs hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
