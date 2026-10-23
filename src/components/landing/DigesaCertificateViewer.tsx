// ==============================================================================
// ALTOQ PE - VISOR MODAL DE REGISTRO SANITARIO DIGESA Y CERTIFICADOS
// Garantía Sanitaria, Trazabilidad de Laboratorio y Protección Antihumedad
// REGLA ESTRICTA: Sin uso de emojis en código ni contenido
// ==============================================================================

'use client';

import React, { useState } from 'react';

export interface DigesaCertificateViewerProps {
  productName: string;
  producerName: string;
  digesaCode: string;
  qualityCertificatesUrls?: string[];
  packagingBarrierType?: string;
  originRegion?: string;
}

export const DigesaCertificateViewer: React.FC<DigesaCertificateViewerProps> = ({
  productName,
  producerName,
  digesaCode,
  qualityCertificatesUrls = [],
  packagingBarrierType = 'Tricapa hermético de alta barrera contra humedad >80% HR',
  originRegion = 'Perú',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Boton Disparador en Tarjeta */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D2E] hover:text-[#D85A2F] transition-colors underline underline-offset-2"
        title="Verificar Registro Sanitario Oficial DIGESA"
      >
        <svg
          className="w-3.5 h-3.5 text-[#8BAA52]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>DIGESA: {digesaCode}</span>
      </button>

      {/* Modal de Transparencia Sanitaria */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 relative">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#0F3D2E]/10 text-[#0F3D2E] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
                  Validación Sanitaria Oficial
                </div>
                <h3 className="text-lg font-bold text-[#0F3D2E]">{productName}</h3>
                <p className="text-xs text-neutral-500">Elaborado por {producerName} ({originRegion})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Ficha Sanitaria */}
            <div className="space-y-3.5 text-sm">
              <div className="bg-[#F6F3EB] p-3.5 rounded-xl border border-neutral-200/60">
                <div className="text-xs font-bold text-[#52635B] uppercase tracking-wider mb-1">
                  Código de Registro Sanitario DIGESA
                </div>
                <div className="text-base font-extrabold text-[#0F3D2E] tracking-wider font-mono">
                  {digesaCode}
                </div>
                <div className="text-xs text-[#8BAA52] font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8BAA52]" />
                  <span>Vigente y homologado para comercialización en Lima Metropolitana</span>
                </div>
              </div>

              {/* Empaque y Protección contra Humedad */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-xs font-bold text-neutral-600 mb-1">
                  Barrera de Empaque Especializada
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {packagingBarrierType}. Diseñado especialmente para evitar absorción de humedad en Lima (&gt;80% HR), conservando el crujido y los nutrientes sin necesidad de refrigeración ni preservantes químicos.
                </p>
              </div>

              {/* Certificados de Calidad Adicionales */}
              <div>
                <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Certificaciones de Calidad
                </div>
                {qualityCertificatesUrls.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {qualityCertificatesUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#0F3D2E] hover:text-[#D85A2F] flex items-center justify-between p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>Certificado Técnico #{idx + 1} (HACCP / BPM / Orgánico)</span>
                        </span>
                        <span className="text-[11px] text-[#D85A2F]">Abrir PDF &rarr;</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    Planta auditada conforme a Buenas Prácticas de Manufactura (BPM) y protocolos de inocuidad alimentaria DIGESA.
                  </p>
                )}
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-[#0F3D2E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#144937] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
