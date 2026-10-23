import React from 'react';
import { FileDown, ShieldCheck, Box, Send, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface WholesaleItem {
  id: string;
  name: string;
  producer: string;
  origin: string;
  boxSizeUnits: number;
  moqBoxes: number;
  pricePerUnitPen: number;
  pricePerBoxPen: number;
  digesaCode: string;
  stockBoxesInLima: number;
  techSheetUrl: string;
  octagons: number;
}

const WHOLESALE_CATALOG: WholesaleItem[] = [
  {
    id: 'ws-01',
    name: 'Ají de Gallina Liofilizado (Pouch 45g - Rinde 380g)',
    producer: 'Agroindustrias del Valle Sagrado',
    origin: 'Cusco',
    boxSizeUnits: 24,
    moqBoxes: 2, // Mínimo 48 unidades
    pricePerUnitPen: 16.50, // vs 22.50 minorista
    pricePerBoxPen: 396.00,
    digesaCode: 'RSA-P2409821-LIMA',
    stockBoxesInLima: 18,
    techSheetUrl: '#descargar-ficha-aji',
    octagons: 1,
  },
  {
    id: 'ws-02',
    name: 'Sopa Criolla con Carne Mechada (Pouch 50g - Rinde 420g)',
    producer: 'BioAlimentos de Junín',
    origin: 'Junín',
    boxSizeUnits: 24,
    moqBoxes: 2,
    pricePerUnitPen: 14.50, // vs 19.90 minorista
    pricePerBoxPen: 348.00,
    digesaCode: 'RSA-N8923019-DIGESA',
    stockBoxesInLima: 22,
    techSheetUrl: '#descargar-ficha-sopa',
    octagons: 0,
  },
  {
    id: 'ws-03',
    name: 'Pack Degustación Andino 4 Variedades (Caja x 12 Packs)',
    producer: 'Cooperativa Alto Andina Puno',
    origin: 'Puno',
    boxSizeUnits: 12,
    moqBoxes: 1,
    pricePerUnitPen: 35.00, // vs 44.90 minorista
    pricePerBoxPen: 420.00,
    digesaCode: 'RSA-H1029384-PUNO',
    stockBoxesInLima: 15,
    techSheetUrl: '#descargar-ficha-pack',
    octagons: 0,
  },
];

export default function WholesaleConsumerPage() {
  return (
    <div className="space-y-8">
      {/* 1. Encabezado B2B y Solicitud Rápida de Cotización */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-secondary-dark mb-1">
              <Box className="w-4 h-4" />
              <span>Compras Corporativas y HORECA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              Precios Escalonados por Volumen y Lotes
            </h1>
            <p className="text-sm text-brand-text-muted mt-1 max-w-2xl">
              Abastécete directamente de plantas agroindustriales peruanas. Todos los lotes cuentan con inspección en el centro de acopio seco en Lima, embalaje rígido anti-humedad y registro sanitario DIGESA al día.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-brand-md bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-light transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Cotización a Medida</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-brand-md bg-white border border-brand-primary/20 text-brand-primary font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Descargar Catálogo Excel / PDF</span>
            </button>
          </div>
        </div>

        {/* Garantías de Calidad para Auditoría de Compras */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 text-xs">
          <div className="flex items-center space-x-2 text-brand-text-muted">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Fichas técnicas bromatológicas descargables</span>
          </div>
          <div className="flex items-center space-x-2 text-brand-text-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Facturación electrónica con RUC y guías de remisión</span>
          </div>
          <div className="flex items-center space-x-2 text-brand-text-muted">
            <AlertCircle className="w-4 h-4 text-brand-secondary-dark flex-shrink-0" />
            <span>Empaque tricapa barrera vapor &lt; 0.1 g/m²/día</span>
          </div>
        </div>
      </div>

      {/* 2. Tabla de Catálogo Mayorista */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-brand-primary">
            Lotes Disponibles en Acopio Seco Lima
          </h2>
          <span className="text-xs font-semibold text-brand-text-muted">
            Mostrando 3 presentaciones para despacho inmediato
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-brand-text-muted uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Producto y Productor</th>
                <th className="py-3 px-4">Registro DIGESA</th>
                <th className="py-3 px-4">Presentación</th>
                <th className="py-3 px-4">Pedido Mín. (MOQ)</th>
                <th className="py-3 px-4">Precio Unitario</th>
                <th className="py-3 px-4">Precio Caja (con IGV)</th>
                <th className="py-3 px-4">Stock Lima</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {WHOLESALE_CATALOG.map((item) => (
                <tr key={item.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-brand-primary">
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-brand-text-muted font-normal text-[11px]">
                      {item.producer} • {item.origin}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700">
                      {item.digesaCode}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-brand-text-muted">
                    Caja máster x {item.boxSizeUnits} pouches
                  </td>
                  <td className="py-4 px-4 font-bold text-brand-primary">
                    {item.moqBoxes} {item.moqBoxes === 1 ? 'caja' : 'cajas'} ({item.moqBoxes * item.boxSizeUnits} u.)
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-800 text-sm">
                    S/ {item.pricePerUnitPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-brand-primary text-sm">
                    S/ {item.pricePerBoxPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.stockBoxesInLima} cajas
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <a
                      href={item.techSheetUrl}
                      className="inline-flex items-center space-x-1 p-1.5 text-gray-500 hover:text-brand-primary transition-colors"
                      title="Descargar Ficha Técnica"
                    >
                      <FileDown className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-brand-sm bg-brand-primary text-white font-bold text-[11px] hover:bg-brand-primary-light transition-colors"
                    >
                      Añadir al Pedido
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
