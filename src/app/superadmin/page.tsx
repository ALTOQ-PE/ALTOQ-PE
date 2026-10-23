import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, DollarSign, ArrowUpRight, FileCheck, Warehouse, Sparkles } from 'lucide-react';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-10">
      {/* 1. Métricas Globales del Ecosistema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#122D23] border border-emerald-800/40 rounded-brand-lg p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Margen Unitario Promedio (MCu)
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            29.5% por Pedido
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            MCu = S/ 8.85 netos tras flete, empaque y pasarela
          </div>
        </div>

        <div className="bg-[#122D23] border border-emerald-800/40 rounded-brand-lg p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Vouchers Yape/Plin por Validar
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            2 pendientes
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            S/ 115.00 en cola de confirmación manual
          </div>
        </div>

        <div className="bg-[#122D23] border border-emerald-800/40 rounded-brand-lg p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Curaduría Sanitaria (DIGESA)
          </div>
          <div className="text-2xl font-black text-white mt-2">
            1 producto nuevo
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            Filtro de salud: &le; 2 Octógonos verificado
          </div>
        </div>

        <div className="bg-[#122D23] border border-emerald-800/40 rounded-brand-lg p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Liquidaciones Quincenales
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            S/ 14,890.00
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            A dispersar a 6 productores el 31 de Octubre
          </div>
        </div>
      </div>

      {/* 2. Curaduría Sanitaria de Productos (Filtro Infranqueable de DIGESA y Octógonos) */}
      <section className="bg-[#122D23] border border-emerald-800/50 rounded-brand-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-800/40 gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Gobernanza Sanitaria Obligatoria</span>
            </div>
            <h2 className="text-lg font-black text-white">
              Bandeja de Curaduría Sanitaria para Catálogo
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            Regla de Sistema: Productos con más de 2 octógonos son rechazados por código
          </span>
        </div>

        <div className="mt-6 bg-[#0E241C] border border-emerald-800/30 rounded-brand-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Nuevo Registro
              </span>
              <span className="text-xs text-gray-400">Productor: Agroindustrias del Valle Sagrado (Cusco)</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Crema Concentrada de Tarwi Andino (40g - Rinde 320g)
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
              <span>DIGESA: <strong className="font-mono text-emerald-400">RSA-T8102931-DIGESA</strong></span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/60 text-emerald-300 font-bold">
                0 Octógonos • 100% Natural
              </span>
              <span>•</span>
              <span>Empaque: <strong>Tricapa con barrera anti-humedad (&lt; 0.1 g/m²/d)</strong></span>
            </div>
            <div className="text-xs text-gray-400">
              Costo Productor: S/ 9.50 • Precio Público Sugerido: S/ 18.00 • Margen Bruto: 47.2%
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-brand-md bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobar y Publicar en Catálogo</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-brand-md bg-red-900/40 border border-red-700/50 text-red-300 font-bold text-xs hover:bg-red-900/60 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Rechazar</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Validación de Pagos Manuales (Vouchers Yape / Plin) */}
      <section className="bg-[#122D23] border border-emerald-800/50 rounded-brand-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
          <div>
            <span className="text-xs font-bold uppercase text-amber-400">
              Validación Manual de Pasarela
            </span>
            <h2 className="text-lg font-black text-white">
              Comprobantes Yape / Plin Pendientes
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            Al validar, el pedido pasa a fase: &quot;2. Alistado en Acopio Seco&quot;
          </span>
        </div>

        <div className="mt-4 divide-y divide-emerald-900/40">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-400">#ORD-2026-0045</span>
                <span className="text-xs text-gray-400">• Consumidor: Juan Pérez (San Isidro)</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">
                Yape • Monto: <span className="text-emerald-400 font-extrabold">S/ 45.00</span>
              </div>
              <div className="text-xs font-mono text-gray-400">
                Op: 89123847 • Fecha: Hoy a las 03:14 am • 2 pouches Ají de Gallina Liofilizado
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="px-3.5 py-2 rounded-brand-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
              >
                Confirmar Pago y Despachar
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-brand-md bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs font-semibold transition-colors"
              >
                Ver Comprobante
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Desglose en Vivo de Unit Economics (MCu) */}
      <section className="bg-[#122D23] border border-emerald-800/50 rounded-brand-xl p-6 shadow-md">
        <div className="pb-4 border-b border-emerald-800/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">
              Cálculo Real de Unit Economics por Pedido Típico
            </h2>
            <span className="text-xs font-mono bg-emerald-950 px-2.5 py-1 rounded text-emerald-300 border border-emerald-700/50">
              MCu = (P + F) - (C_prod + C_emp + C_env + C_pas + Prov)
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Simulación transparente sobre un pedido promedio de 1 pouch liofilizado en Lima Metropolitana.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 text-center text-xs">
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">P (PVP)</span>
            <span className="text-sm font-extrabold text-white mt-1 block">S/ 22.50</span>
          </div>
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">F (Flete Cobrado)</span>
            <span className="text-sm font-extrabold text-white mt-1 block">S/ 7.50</span>
          </div>
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">- C_prod (Productor)</span>
            <span className="text-sm font-extrabold text-red-300 mt-1 block">-S/ 12.00</span>
          </div>
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">- C_emp (Caja Rígida)</span>
            <span className="text-sm font-extrabold text-red-300 mt-1 block">-S/ 1.20</span>
          </div>
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">- C_env (Courier Real)</span>
            <span className="text-sm font-extrabold text-red-300 mt-1 block">-S/ 6.50</span>
          </div>
          <div className="p-3 bg-[#0E241C] rounded border border-emerald-900/60">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">- C_pas (Yape/Culqi)</span>
            <span className="text-sm font-extrabold text-red-300 mt-1 block">-S/ 0.95</span>
          </div>
          <div className="p-3 bg-emerald-950 rounded border border-emerald-500/50">
            <span className="text-emerald-400 block text-[10px] uppercase font-black">MCu Neto</span>
            <span className="text-sm font-black text-emerald-300 mt-1 block">S/ 8.85 (29.5%)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
