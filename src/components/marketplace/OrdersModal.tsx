'use client';

import React, { useEffect, useState } from 'react';
import { useMarketplace } from './MarketplaceContext';
import {
  Package,
  X,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Building2,
  Phone,
  RefreshCw
} from 'lucide-react';
import type { StoredOrder } from '@/lib/storage';

export const OrdersModal: React.FC = () => {
  const { isOrdersOpen, setIsOrdersOpen, currentRole, currentUser } = useMarketplace();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOrdersOpen) {
      fetchOrders();
    }
  }, [isOrdersOpen]);

  if (!isOrdersOpen) return null;

  const STATUS_LABELS: Record<StoredOrder['status'], { label: string; color: string; step: number }> = {
    PAGO_VALIDADO: { label: '1. Pago Validado', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', step: 1 },
    ALISTADO_EN_SECO: { label: '2. Alistado en Acopio Lima (<50% HR)', color: 'bg-amber-100 text-amber-800 border-amber-200', step: 2 },
    EN_RUTA_COURIER: { label: '3. En Ruta Courier Lima', color: 'bg-blue-100 text-blue-800 border-blue-200', step: 3 },
    ENTREGADO: { label: '4. Entregado con Garantía', color: 'bg-emerald-600 text-white border-emerald-700', step: 4 },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOrdersOpen(false)}
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-brand-xl shadow-2xl border border-brand-primary/10 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="bg-[#0F3D2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Package className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base">
                {currentRole === 'SUPERADMIN' ? 'Centro de Gestión de Pedidos en Vivo' : 'Mis Pedidos y Seguimiento'}
              </h3>
              <p className="text-[11px] text-emerald-100">
                Logística centralizada con protección anti-humedad de Lima (&gt;80% HR)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOrdersOpen(false)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Órdenes */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="flex justify-between items-center text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>
              Mostrando <strong>{orders.length}</strong> orden(es) registrada(s)
            </span>
            <button
              type="button"
              onClick={fetchOrders}
              className="flex items-center space-x-1 text-brand-primary hover:underline font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">Aún no tienes pedidos registrados</p>
              <p className="text-xs text-gray-400">
                Agrega alimentos al carrito y confirma tu primera orden con entrega garantizada.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.PAGO_VALIDADO;

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-brand-lg border border-gray-200 bg-gray-50/70 space-y-3 shadow-sm hover:border-brand-primary/30 transition-all"
                >
                  {/* Fila Superior: Código y Estado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                    <div>
                      <span className="font-mono font-black text-sm text-brand-primary">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        Registrado el {new Date(order.createdAt).toLocaleString('es-PE')}
                      </span>
                    </div>

                    <div className={`px-3 py-1 rounded-full border text-[11px] font-extrabold flex items-center space-x-1 self-start sm:self-auto ${statusInfo.color}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Barra de Progreso de 4 Pasos */}
                  <div className="py-1">
                    <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                      <div className={`py-1 rounded ${statusInfo.step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        1. Pago OK
                      </div>
                      <div className={`py-1 rounded ${statusInfo.step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        2. Acopio Lima
                      </div>
                      <div className={`py-1 rounded ${statusInfo.step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        3. En Ruta
                      </div>
                      <div className={`py-1 rounded ${statusInfo.step >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        4. Entregado
                      </div>
                    </div>
                  </div>

                  {/* Items del Pedido */}
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-gray-400 block">
                      Productos:
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="truncate pr-2">
                          • {item.quantity}x {item.productName} {item.isBox ? '(Caja máster)' : ''}
                        </span>
                        <span className="font-mono font-semibold text-gray-900 flex-shrink-0">
                          S/ {(item.pricePen * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Datos de Despacho y Total */}
                  <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                    <div className="text-gray-600 space-y-0.5">
                      <div className="flex items-center space-x-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                        <span className="truncate">{order.deliveryAddress || 'Lima Metropolitana'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span>{order.contactPhone || '+51 984 123 456'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Total con IGV</span>
                      <span className="font-black text-sm text-brand-primary font-mono">
                        S/ {order.totalPen.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-500">
            Garantía ALTOQ PE: Devolución asegurada en Altoq Créditos
          </span>
          <button
            type="button"
            onClick={() => setIsOrdersOpen(false)}
            className="px-4 py-2 bg-[#0F3D2E] text-white font-bold rounded-brand-md text-xs hover:bg-[#18523f] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
