'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from './MarketplaceContext';
import type { Role as UserRole } from '@/types';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  Award,
  ShieldCheck,
  Building2,
  Package,
  Activity,
  ChevronDown,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';

export const MarketplaceNavbar: React.FC = () => {
  const {
    currentRole,
    setRole,
    consumerPlan,
    setConsumerPlan,
    cart,
    setIsCartOpen,
    setIsOrdersOpen,
    setIsQuoteModalOpen,
    setIsProducerModalOpen,
    currentUser,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filipuntosBalance,
    altoqCreditsBalance,
  } = useMarketplace();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Total de unidades en carrito
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Opciones de Roles disponibles para el selector interactivo
  const ROLES_LIST: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'CONSUMER_RETAIL',
      title: 'Consumidor Minorista (B2C)',
      subtitle: 'Pouches individuales, packs de prueba, recetas express y Filipuntos',
      icon: <Award className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'CONSUMER_WHOLESALE',
      title: 'Consumidor Mayorista (B2B)',
      subtitle: 'Precios por caja, lotes HORECA, MOQ y cotizaciones con RUC',
      icon: <Building2 className="w-4 h-4 text-brand-secondary-dark" />,
    },
    {
      id: 'PRODUCER',
      title: 'Proveedor Agroindustrial',
      subtitle: 'Gestión de productos, stock en acopio Lima y liquidaciones',
      icon: <Package className="w-4 h-4 text-brand-accent" />,
    },
    {
      id: 'SUPERADMIN',
      title: 'SuperAdmin / Gobernanza',
      subtitle: 'Curaduría DIGESA, telemetría de humedad y Unit Economics',
      icon: <Activity className="w-4 h-4 text-red-600" />,
    },
  ];

  const currentRoleObj = ROLES_LIST.find((r) => r.id === currentRole) || ROLES_LIST[0];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-brand-primary/10">
      {/* 1. Barra de Utilidad Superior Tipo Saga Falabella */}
      <div className="bg-[#0A291F] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Mensaje de Logística y Garantía */}
          <div className="flex items-center space-x-2 text-[11px] text-emerald-100">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Despacho Centralizado desde Acopio Seco Lima • Protección Humedad (&gt;80% HR) • Registro DIGESA
            </span>
          </div>

          {/* Selector de Rol Dinámico y Selector de Plan de Comprador */}
          <div className="flex items-center space-x-3">
            {/* Toggle Plan Gratuito vs Plan Oro para Compradores */}
            {(currentRole === 'CONSUMER_RETAIL' || currentRole === 'CONSUMER_WHOLESALE') && (
              <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/15">
                <span className="text-gray-300 text-[10px]">Plan:</span>
                <button
                  type="button"
                  onClick={() => setConsumerPlan(consumerPlan === 'PLAN_ORO' ? 'PLAN_GRATUITO' : 'PLAN_ORO')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                    consumerPlan === 'PLAN_ORO'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'bg-white/20 text-gray-200 hover:bg-white/30'
                  }`}
                  title="Haz clic para alternar entre Plan Gratuito y Plan Oro"
                >
                  {consumerPlan === 'PLAN_ORO' ? 'Plan Oro Activo' : 'Plan Gratuito'}
                </button>
              </div>
            )}

            {/* Selector de Rol */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold text-xs border border-white/20"
              >
                <span>Sesión activa:</span>
                <strong className="text-emerald-300 flex items-center space-x-1">
                  <span>{currentRoleObj.title}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </strong>
              </button>

              {/* Menú Desplegable de Roles */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-brand-lg shadow-2xl border border-gray-200 py-2 z-50 text-brand-text-main animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500">
                    Cambiar Cuenta de Demostración
                  </div>
                  {ROLES_LIST.map((roleItem) => (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => {
                        setRole(roleItem.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 hover:bg-emerald-50/70 transition-colors ${
                        currentRole === roleItem.id ? 'bg-emerald-50 border-l-4 border-brand-primary' : ''
                      }`}
                    >
                      <div className="mt-0.5">{roleItem.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-brand-primary">
                          {roleItem.title}
                        </div>
                        <div className="text-[11px] text-gray-500 leading-tight">
                          {roleItem.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="px-3 pt-2 border-t border-gray-100">
                    <Link
                      href="/login"
                      className="block text-center py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-brand-primary text-xs font-bold"
                    >
                      Ir a Iniciar Sesión / Crear Cuenta
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="text-[11px] text-emerald-200 hover:text-white underline font-medium"
            >
              Cambiar Cuenta
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal del Marketplace (Buscador, Logo y Acciones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo de ALTOQ PE */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-brand-md bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
            A
          </div>
          <div className="leading-tight">
            <span className="font-black text-2xl tracking-tight text-brand-primary">
              ALTOQ<span className="text-brand-accent">.PE</span>
            </span>
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand-secondary-dark">
              FOOD TECHNOLOGY
            </span>
          </div>
        </Link>

        {/* Buscador Central Grande Tipo Saga Falabella */}
        <div className="flex-1 max-w-2xl mx-2 hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué plato liofilizado, sopa andina o snack buscas hoy? (ej. Ají de gallina)"
              className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-brand-primary/20 focus:border-brand-primary focus:outline-none text-xs sm:text-sm text-brand-text-main placeholder-gray-400 bg-gray-50/50 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-1.5 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-light transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bloque de Usuario y Carrito Adaptativo */}
        <div className="flex items-center space-x-3 sm:space-x-5 flex-shrink-0">
          {/* Ubicación de Despacho en Lima */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-brand-text-muted border-r border-gray-200 pr-4">
            <MapPin className="w-4 h-4 text-brand-accent" />
            <div className="leading-tight">
              <span className="text-[10px] text-gray-400 block">Despacho en:</span>
              <strong className="text-brand-primary">Lima Centro y Playas</strong>
            </div>
          </div>

          {/* Widgets según el Rol Activo */}
          {currentRole === 'CONSUMER_RETAIL' && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-900 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{filipuntosBalance} Filipuntos</span>
              </div>
              <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-900 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>S/ {altoqCreditsBalance.toFixed(2)} Créditos</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOrdersOpen(true)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-brand-primary rounded-full text-[11px] font-bold transition-colors"
              >
                Mis Pedidos
              </button>
            </div>
          )}

          {currentRole === 'CONSUMER_WHOLESALE' && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-900 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser?.companyName ? currentUser.companyName.slice(0, 22) + '...' : 'HORECA B2B'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-[11px] font-bold transition-colors shadow-sm"
              >
                Cotizaciones B2B
              </button>
              <button
                type="button"
                onClick={() => setIsOrdersOpen(true)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-brand-primary rounded-full text-[11px] font-bold transition-colors"
              >
                Mis Pedidos
              </button>
            </div>
          )}

          {currentRole === 'PRODUCER' && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-full text-[11px] font-bold text-orange-900 flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-orange-600" />
                <span>78 u. en Acopio Lima</span>
              </div>
              <button
                type="button"
                onClick={() => setIsProducerModalOpen(true)}
                className="px-2.5 py-1 bg-[#D85A2F] hover:bg-[#b84822] text-white rounded-full text-[11px] font-bold transition-colors shadow-sm"
              >
                + Consignar Alimento
              </button>
            </div>
          )}

          {currentRole === 'SUPERADMIN' && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-2.5 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] font-bold text-red-900 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-red-600" />
                <span>Humedad Acopio: 42% HR</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOrdersOpen(true)}
                className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded-full text-[11px] font-bold transition-colors shadow-sm"
              >
                Gestión de Pedidos
              </button>
            </div>
          )}

          {/* Botón Carrito de Compras */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2 px-3 py-2 rounded-brand-md bg-brand-surface-soft hover:bg-gray-200 transition-colors text-brand-primary"
            aria-label="Ver Carrito de compras"
          >
            <ShoppingCart className="w-5 h-5 text-brand-primary" />
            <span className="hidden sm:inline font-bold text-xs">Carrito</span>
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Barra de Categorías / Mega-Barra Tipo Marketplace */}
      <nav className="bg-brand-bg/80 border-t border-brand-primary/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-6 overflow-x-auto py-2 text-xs font-bold scrollbar-none text-brand-text-muted">
          <button
            type="button"
            onClick={() => setSelectedCategory('TODAS')}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'TODAS'
                ? 'bg-brand-primary text-white'
                : 'hover:text-brand-primary'
            }`}
          >
            Todas las Categorías
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('PLATO_TIPICO_LIOFILIZADO')}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'PLATO_TIPICO_LIOFILIZADO'
                ? 'bg-brand-primary text-white'
                : 'hover:text-brand-primary'
            }`}
          >
            Platos Típicos Liofilizados
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('SOPA_INSTANTANEA')}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'SOPA_INSTANTANEA'
                ? 'bg-brand-primary text-white'
                : 'hover:text-brand-primary'
            }`}
          >
            Sopas Criollas
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('PACK_PRUEBA')}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'PACK_PRUEBA'
                ? 'bg-brand-primary text-white'
                : 'hover:text-brand-primary'
            }`}
          >
            Packs de Degustación
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('SNACK_LIOFILIZADO')}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'SNACK_LIOFILIZADO'
                ? 'bg-brand-primary text-white'
                : 'hover:text-brand-primary'
            }`}
          >
            Snacks y Frutas Crujientes
          </button>

          {/* Pestañas Especiales según Rol */}
          {currentRole === 'CONSUMER_WHOLESALE' && (
            <span className="ml-auto whitespace-nowrap text-brand-secondary-dark font-extrabold flex items-center space-x-1 pl-4 border-l border-gray-300">
              <FileText className="w-3.5 h-3.5" />
              <span>Modo Mayorista Activo: Precios por Caja Máster</span>
            </span>
          )}

          {currentRole === 'PRODUCER' && (
            <span className="ml-auto whitespace-nowrap text-brand-accent font-extrabold flex items-center space-x-1 pl-4 border-l border-gray-300">
              <Package className="w-3.5 h-3.5" />
              <span>Modo Proveedor: Mostrando tu inventario en Acopio Lima</span>
            </span>
          )}

          {currentRole === 'SUPERADMIN' && (
            <span className="ml-auto whitespace-nowrap text-emerald-800 font-extrabold flex items-center space-x-1 pl-4 border-l border-gray-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Modo SuperAdmin: Panel de Aprobación Sanitaria y Telemetría</span>
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};
