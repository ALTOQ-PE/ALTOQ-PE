'use client';

import React from 'react';
import { useMarketplace } from './MarketplaceContext';
import { ShieldCheck, Filter, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const MarketplaceSidebar: React.FC = () => {
  const {
    currentRole,
    selectedOctagons,
    setSelectedOctagons,
    selectedRegion,
    setSelectedRegion,
    selectedCategory,
    setSelectedCategory,
  } = useMarketplace();

  const REGIONS = ['TODAS', 'Cusco', 'Junín', 'Puno', 'San Martín'];

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      {/* 1. Política de Salud Obligatoria ALTOQ PE (<= 2 Octógonos) */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-brand-lg p-4">
        <div className="flex items-start space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
              Garantía de Salud
            </h3>
            <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
              En ALTOQ PE ningún alimento supera los 2 octógonos. Cuidamos tu nutrición sin conservantes artificiales.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filtro por Sellos de Octógonos */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-brand-primary uppercase">
          <Filter className="w-3.5 h-3.5 text-brand-accent" />
          <span>Filtro por Octógonos</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedOctagons(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              selectedOctagons === null
                ? 'bg-brand-primary text-white font-bold'
                : 'text-brand-text-muted hover:bg-gray-100'
            }`}
          >
            <span>Todos (&le; 2 Octógonos)</span>
            <span className="text-[10px] opacity-80">5</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOctagons(0)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              selectedOctagons === 0
                ? 'bg-brand-secondary text-white font-bold'
                : 'text-brand-text-muted hover:bg-gray-100'
            }`}
          >
            <span>0 Octógonos • 100% Natural</span>
            <span className="text-[10px] font-bold text-emerald-700">3</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOctagons(1)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              selectedOctagons === 1
                ? 'bg-amber-600 text-white font-bold'
                : 'text-brand-text-muted hover:bg-gray-100'
            }`}
          >
            <span>Máximo 1 Octógono</span>
            <span className="text-[10px] opacity-80">1</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOctagons(2)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              selectedOctagons === 2
                ? 'bg-brand-primary text-white font-bold'
                : 'text-brand-text-muted hover:bg-gray-100'
            }`}
          >
            <span>2 Octógonos (Límite Ley)</span>
            <span className="text-[10px] opacity-80">1</span>
          </button>
        </div>
      </div>

      {/* 3. Filtro por Región de Origen Agroindustrial */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-brand-primary uppercase">
          <MapPin className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Región de Origen</span>
        </div>

        <div className="space-y-1 text-xs">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                selectedRegion === region
                  ? 'bg-brand-primary text-white font-bold'
                  : 'text-brand-text-muted hover:bg-gray-100'
              }`}
            >
              {region === 'TODAS' ? 'Todas las Regiones' : `${region} (Andes / Amazonía)`}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Información Logística de Lima (>80% HR) */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm text-xs space-y-2">
        <h4 className="font-extrabold text-brand-primary uppercase text-[10px] tracking-wider">
          Protección Contra la Humedad
        </h4>
        <p className="text-[11px] text-brand-text-muted leading-relaxed">
          Lima supera el <strong>80% de humedad relativa</strong>. Todos los productos en ALTOQ PE cuentan con empaque hermético multicapa tricapa que protege la liofilización.
        </p>
      </div>
    </aside>
  );
};
