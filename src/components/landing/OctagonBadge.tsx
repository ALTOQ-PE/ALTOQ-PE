// ==============================================================================
// ALTOQ PE - COMPONENTE DE SELLO VISUAL DE OCTÓGONOS NUTRICIONALES
// Ley N° 30021 de Promoción de la Alimentación Saludable en el Perú
// Regla de Negocio ALTOQ PE: Estrictamente <= 2 octógonos
// REGLA ESTRICTA: Sin uso de emojis en código ni contenido
// ==============================================================================

'use client';

import React from 'react';

export interface OctagonBadgeProps {
  octagonCount: number;
  octagonTypes?: string[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const OctagonBadge: React.FC<OctagonBadgeProps> = ({
  octagonCount,
  octagonTypes = [],
  size = 'md',
  showDetails = false,
}) => {
  // 1. Validacion de politica interna de salud: Prohibido > 2 octogonos
  if (octagonCount > 2) {
    return (
      <div className="bg-red-900/10 border border-red-600/30 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span>Bloqueado por Política ALTOQ PE: Supera 2 octógonos</span>
      </div>
    );
  }

  // 2. Escenario Cero Octogonos (100% Puro y Natural)
  if (octagonCount === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-[#8BAA52]/15 border border-[#8BAA52]/30 text-[#0F3D2E] px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
        <svg
          className="w-3.5 h-3.5 text-[#8BAA52]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>0 Octógonos • 100% Natural</span>
      </div>
    );
  }

  // 3. Escenario 1 o 2 Octogonos (Permitidos con Advertencia Sanitaria)
  const formatOctagonName = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ALTO_EN_SODIO':
        return 'ALTO EN SODIO';
      case 'ALTO_EN_AZUCAR':
        return 'ALTO EN AZÚCAR';
      case 'ALTO_EN_GRASAS_SATURADAS':
        return 'ALTO EN GRASAS SAT.';
      case 'CONTIENE_GRASAS_TRANS':
        return 'GRASAS TRANS';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        {octagonTypes.length > 0 ? (
          octagonTypes.slice(0, 2).map((oct, idx) => (
            <div
              key={idx}
              className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border border-neutral-700 shadow-sm flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D85A2F]" />
              <span>{formatOctagonName(oct)}</span>
            </div>
          ))
        ) : (
          <div className="bg-neutral-900 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border border-neutral-700 shadow-sm">
            {octagonCount} {octagonCount === 1 ? 'OCTÓGONO' : 'OCTÓGONOS'}
          </div>
        )}
      </div>

      {showDetails && (
        <span className="text-[10px] text-neutral-500 font-medium">
          Cumple límite legal ALTOQ PE (Máx. 2 octógonos)
        </span>
      )}
    </div>
  );
};
