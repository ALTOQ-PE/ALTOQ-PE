'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  AlertCircle,
  Calendar,
  CreditCard,
  Receipt
} from 'lucide-react';

interface SettlementItem {
  id: string;
  code: string;
  period: string;
  soldUnits: number;
  grossSalesPen: number;
  altoqCommissionPen: number;
  storageAndLogisticsPen: number;
  netPayoutPen: number;
  payoutDate: string;
  status: 'ABONADO' | 'EN_DISPERSION';
  operationNumber?: string;
}

const SETTLEMENT_HISTORY: SettlementItem[] = [
  {
    id: 'liq-01',
    code: 'LIQ-2026-10-Q2',
    period: '16 al 31 de Octubre, 2026',
    soldUnits: 182,
    grossSalesPen: 5000.00,
    altoqCommissionPen: 750.00, // 15%
    storageAndLogisticsPen: 0.00, // Bonificado por Plan Oro
    netPayoutPen: 4250.00,
    payoutDate: '31 de Octubre, 2026',
    status: 'EN_DISPERSION',
  },
  {
    id: 'liq-02',
    code: 'LIQ-2026-10-Q1',
    period: '01 al 15 de Octubre, 2026',
    soldUnits: 154,
    grossSalesPen: 4200.00,
    altoqCommissionPen: 630.00,
    storageAndLogisticsPen: 0.00,
    netPayoutPen: 3570.00,
    payoutDate: '16 de Octubre, 2026',
    status: 'ABONADO',
    operationNumber: 'BCP-OP-8921049',
  },
  {
    id: 'liq-03',
    code: 'LIQ-2026-09-Q2',
    period: '16 al 30 de Septiembre, 2026',
    soldUnits: 198,
    grossSalesPen: 5400.00,
    altoqCommissionPen: 810.00,
    storageAndLogisticsPen: 0.00,
    netPayoutPen: 4590.00,
    payoutDate: '30 de Septiembre, 2026',
    status: 'ABONADO',
    operationNumber: 'BCP-OP-7749102',
  },
  {
    id: 'liq-04',
    code: 'LIQ-2026-09-Q1',
    period: '01 al 15 de Septiembre, 2026',
    soldUnits: 140,
    grossSalesPen: 3850.00,
    altoqCommissionPen: 577.50,
    storageAndLogisticsPen: 0.00,
    netPayoutPen: 3272.50,
    payoutDate: '16 de Septiembre, 2026',
    status: 'ABONADO',
    operationNumber: 'BCP-OP-6592019',
  },
];

export default function LiquidacionesPage() {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = (code: string) => {
    setDownloadNotice(`Generando resumen bromatológico y fiscal de ${code}.xlsx`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado y Navegación */}
      <div>
        <Link
          href="/producer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Productos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
              Liquidaciones Bancarias Quincenales
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              Desglose transparente de ventas, comisiones comerciales y dispersiones bancarias automáticas.
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-brand-md text-emerald-900 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pagos Garantizados Quincenales</span>
          </div>
        </div>
      </div>

      {/* Notificación de Descarga */}
      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-brand-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Resumen Financiero Superior */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F3D2E] text-white rounded-brand-xl p-5 shadow-sm space-y-1">
          <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
            Próximo Abono Programado
          </div>
          <div className="text-3xl font-black text-white">
            S/ 4,250.00
          </div>
          <div className="text-[11px] text-emerald-200 flex items-center space-x-1 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fecha de dispersión: 31 de Octubre, 2026</span>
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-5 shadow-sm space-y-1">
          <div className="text-brand-text-muted text-xs font-bold uppercase tracking-wider">
            Total Liquidado en 2026
          </div>
          <div className="text-3xl font-black text-brand-primary">
            S/ 48,920.00
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            100% de períodos liquidados a tiempo
          </div>
        </div>

        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-5 shadow-sm space-y-2">
          <div className="text-brand-text-muted text-xs font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Cuenta de Abono Verificada</span>
            <Building className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-xs space-y-0.5 text-brand-primary font-bold">
            <div>BCP Banco de Crédito del Perú</div>
            <div className="font-mono text-[11px] text-gray-600">Cta: 193-982341-0-28</div>
            <div className="font-mono text-[10px] text-gray-500">CCI: 002-19300982341028-14</div>
          </div>
        </div>
      </div>

      {/* Tabla de Historial de Liquidaciones */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-brand-primary">
            Estados de Cuenta Quincenales
          </h2>
          <span className="text-xs text-brand-text-muted">
            Mostrando {SETTLEMENT_HISTORY.length} períodos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-brand-text-muted uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Período de Ventas</th>
                <th className="py-3 px-4">Unidades</th>
                <th className="py-3 px-4">Venta Bruta</th>
                <th className="py-3 px-4">Comisión ALTOQ (15%)</th>
                <th className="py-3 px-4">Neto a Liquidar</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SETTLEMENT_HISTORY.map((item) => (
                <tr key={item.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-brand-primary">
                    {item.code}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {item.period}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-700">
                    {item.soldUnits} u.
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    S/ {item.grossSalesPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-semibold text-red-700">
                    - S/ {item.altoqCommissionPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-black text-emerald-800 text-sm">
                    S/ {item.netPayoutPen.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    {item.status === 'ABONADO' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Abonado en Cuenta</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>En Dispersión</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(item.code)}
                      className="px-2.5 py-1.5 rounded border border-gray-300 hover:border-brand-primary text-brand-primary font-bold text-[11px] inline-flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3 text-gray-500" />
                      <span>Descargar</span>
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
