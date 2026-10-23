'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/components/marketplace/MarketplaceContext';
import {
  ArrowLeft,
  Warehouse,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  Droplets,
  Truck,
  Plus,
  Package,
  Layers,
  FileText
} from 'lucide-react';

interface ConsignedLot {
  id: string;
  productName: string;
  lotCode: string;
  receivedDate: string;
  expirationDate: string;
  totalReceivedUnits: number;
  availableStock: number;
  reservedStock: number;
  status: 'OPTIMO' | 'BAJO_STOCK' | 'EN_TRANSITO';
}

const INITIAL_LOTS: ConsignedLot[] = [
  {
    id: 'lot-01',
    productName: 'Ají de Gallina Liofilizado Tradicional (45g)',
    lotCode: 'LOT-CUS-2026-08',
    receivedDate: '12 de Octubre, 2026',
    expirationDate: 'Octubre 2028 (24 meses)',
    totalReceivedUnits: 80,
    availableStock: 48,
    reservedStock: 12,
    status: 'OPTIMO',
  },
  {
    id: 'lot-02',
    productName: 'Carapulcra con Panceta Liofilizada (55g)',
    lotCode: 'LOT-CUS-2026-09',
    receivedDate: '16 de Octubre, 2026',
    expirationDate: 'Octubre 2028 (24 meses)',
    totalReceivedUnits: 50,
    availableStock: 30,
    reservedStock: 6,
    status: 'OPTIMO',
  },
  {
    id: 'lot-03',
    productName: 'Crema Concentrada de Tarwi Andino (40g)',
    lotCode: 'LOT-JUN-2026-04',
    receivedDate: 'Pendiente de arribo',
    expirationDate: 'Noviembre 2028',
    totalReceivedUnits: 60,
    availableStock: 0,
    reservedStock: 0,
    status: 'EN_TRANSITO',
  },
];

export default function AcopioLimaPage() {
  const { currentUser } = useMarketplace();
  const [lots, setLots] = useState<ConsignedLot[]>(INITIAL_LOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario nuevo lote
  const [selectedProduct, setSelectedProduct] = useState('Ají de Gallina Liofilizado Tradicional (45g)');
  const [quantityUnits, setQuantityUnits] = useState(48);
  const [courierCompany, setCourierCompany] = useState('Shalom Cargo');
  const [trackingGuideNumber, setTrackingGuideNumber] = useState('001-928419');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: ConsignedLot = {
      id: `lot-${Date.now()}`,
      productName: selectedProduct,
      lotCode: `LOT-REG-2026-${Math.floor(10 + Math.random() * 89)}`,
      receivedDate: 'Estimado en 48 horas',
      expirationDate: 'Noviembre 2028 (24 meses)',
      totalReceivedUnits: Number(quantityUnits),
      availableStock: Number(quantityUnits),
      reservedStock: 0,
      status: 'EN_TRANSITO',
    };

    setLots((prev) => [newLot, ...prev]);
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setIsModalOpen(false);
    }, 1500);
  };

  const totalAvailableStock = lots.reduce((acc, curr) => acc + curr.availableStock, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado y Navegación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/producer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Productos</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
            Inventario Consignado en Acopio Lima
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
            Centro de custodia seca y despacho centralizado de ALTOQ PE (Lima Callao).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-light text-white font-extrabold text-xs transition-colors flex items-center space-x-2 shadow-sm self-start sm:self-auto"
        >
          <Truck className="w-4 h-4" />
          <span>+ Enviar Nuevo Lote a Lima</span>
        </button>
      </div>

      {/* Tarjeta de Telemetría Ambiental del Almacén Seco */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
          <div className="flex items-center space-x-2">
            <Warehouse className="w-5 h-5 text-brand-primary" />
            <span className="font-extrabold text-sm text-brand-primary">
              Cámara de Acopio Seco • Sede Faucett / Callao
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Monitoreo en Tiempo Real: Conforme
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-brand-md bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span>Humedad Cámara Interior</span>
              <Droplets className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">
              41.8% HR
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              Control activo anti-humedad (&lt; 45% HR óptimo)
            </div>
          </div>

          <div className="p-3.5 rounded-brand-md bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>Humedad Exterior Lima</span>
              <Droplets className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              84.5% HR
            </div>
            <div className="text-[10px] text-amber-800 mt-0.5">
              Protegido con barrera tricapa foil termosellada
            </div>
          </div>

          <div className="p-3.5 rounded-brand-md bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
              <span>Temperatura Estable</span>
              <Thermometer className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-900 mt-1">
              20.4 °C
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">
              Ambiente climatizado para proteger nutrientes
            </div>
          </div>

          <div className="p-3.5 rounded-brand-md bg-[#0F3D2E] text-white">
            <div className="flex items-center justify-between text-emerald-200 text-xs font-bold">
              <span>Stock Total en Lima</span>
              <Package className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalAvailableStock} unidades
            </div>
            <div className="text-[10px] text-emerald-200 mt-0.5">
              Listas para entrega local en menos de 24 horas
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Lotes Consignados */}
      <div className="bg-white border border-brand-primary/10 rounded-brand-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-brand-primary">
            Lotes Físicos de tu Empresa en Lima
          </h2>
          <span className="text-xs text-brand-text-muted">
            {lots.length} lotes registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-brand-text-muted uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Producto Liofilizado</th>
                <th className="py-3 px-4">Código de Lote</th>
                <th className="py-3 px-4">Ingreso en Lima</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4">Stock Disponible</th>
                <th className="py-3 px-4">En Tránsito / Reservado</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-brand-primary text-sm">
                    {lot.productName}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-gray-700">
                    {lot.lotCode}
                  </td>
                  <td className="py-4 px-4 text-brand-text-muted">
                    {lot.receivedDate}
                  </td>
                  <td className="py-4 px-4 text-brand-text-muted">
                    {lot.expirationDate}
                  </td>
                  <td className="py-4 px-4 font-black text-emerald-800 text-sm">
                    {lot.availableStock} u.
                  </td>
                  <td className="py-4 px-4 text-gray-500 font-semibold">
                    {lot.reservedStock} u.
                  </td>
                  <td className="py-4 px-4">
                    {lot.status === 'OPTIMO' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>En Cámara Segura</span>
                      </span>
                    ) : lot.status === 'EN_TRANSITO' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                        <Truck className="w-3 h-3 text-blue-700" />
                        <span>En Tránsito</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        <span>Bajo Stock</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Registrar Nuevo Envío a Lima */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-brand-xl max-w-lg w-full p-6 shadow-2xl border border-brand-primary/10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-brand-primary flex items-center space-x-2">
                <Truck className="w-5 h-5 text-brand-secondary" />
                <span>Programar Despacho hacia Acopio Lima</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-brand-md text-emerald-900 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div>¡Lote registrado en tránsito!</div>
                <div className="text-[11px] font-normal text-emerald-700">
                  El equipo de recepción en Lima Callao ha sido notificado para la inspección hermética de ingreso.
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateShipment} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Selecciona el Producto:
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white font-medium"
                  >
                    <option value="Ají de Gallina Liofilizado Tradicional (45g)">
                      Ají de Gallina Liofilizado Tradicional (45g)
                    </option>
                    <option value="Carapulcra con Panceta Liofilizada (55g)">
                      Carapulcra con Panceta Liofilizada (55g)
                    </option>
                    <option value="Crema Concentrada de Tarwi Andino (40g)">
                      Crema Concentrada de Tarwi Andino (40g)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Cantidad de Pouches:
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="1000"
                      value={quantityUnits}
                      onChange={(e) => setQuantityUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Agencia de Transporte:
                    </label>
                    <select
                      value={courierCompany}
                      onChange={(e) => setCourierCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white font-medium"
                    >
                      <option value="Shalom Cargo">Shalom Cargo</option>
                      <option value="Marvisur">Marvisur</option>
                      <option value="Olva Courier">Olva Courier</option>
                      <option value="Cruz del Sur Cargo">Cruz del Sur Cargo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    N° de Guía de Remisión o Tracking:
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingGuideNumber}
                    onChange={(e) => setTrackingGuideNumber(e.target.value)}
                    placeholder="Ej. TKG-98214-CUS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white font-mono"
                  />
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-brand-md text-[11px] text-gray-600 leading-relaxed">
                  <strong>Destino de Entrega:</strong> Almacén Central ALTOQ PE • Av. Elmer Faucett 1850, Módulo 4-B, Callao, Lima. Horario de recepción: Lunes a Viernes de 8:00 a 17:00.
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-brand-md text-gray-700 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary text-white rounded-brand-md font-extrabold hover:bg-brand-primary-light transition-colors"
                  >
                    Confirmar Envío de Lote
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
