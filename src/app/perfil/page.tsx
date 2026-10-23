'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketplaceProvider, useMarketplace } from '@/components/marketplace/MarketplaceContext';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import type { Role as UserRole, PaymentMethod } from '@/types';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  LogOut,
  Save,
  Package,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface UserProfileData {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  address: string;
  preferredPaymentMethod: PaymentMethod;
  consumerPlan: 'PLAN_GRATUITO' | 'PLAN_ORO';
  producerPlan: 'PLAN_PLATA' | 'PLAN_ORO';
  filipuntosBalance: number;
  altoqCreditsBalance: number;
  companyName: string;
  companyRuc: string;
  digesaRegistryCode: string;
  qualityCertificates: string[];
  maxOctagonsAffidavit: boolean;
  originRegion: string;
  createdAt?: string;
}

function PerfilContent() {
  const router = useRouter();
  const { refreshUser, setIsOrdersOpen, setIsQuoteModalOpen } = useMarketplace();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Datos del perfil
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Campos de formulario editables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>('YAPE_PLIN');
  const [consumerPlan, setConsumerPlan] = useState<'PLAN_GRATUITO' | 'PLAN_ORO'>('PLAN_GRATUITO');
  const [producerPlan, setProducerPlan] = useState<'PLAN_PLATA' | 'PLAN_ORO'>('PLAN_PLATA');
  const [companyName, setCompanyName] = useState('');
  const [companyRuc, setCompanyRuc] = useState('');
  const [digesaRegistryCode, setDigesaRegistryCode] = useState('');
  const [originRegion, setOriginRegion] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  // Cargar datos reales desde la API
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) {
          setProfile(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          const u = data.user;
          setProfile(u);
          setFirstName(u.firstName || '');
          setLastName(u.lastName || '');
          setDni(u.dni || '');
          setPhone(u.phone || '');
          setAddress(u.address || '');
          setPreferredPaymentMethod(u.preferredPaymentMethod || 'YAPE_PLIN');
          setConsumerPlan(u.consumerPlan || 'PLAN_GRATUITO');
          setProducerPlan(u.producerPlan || 'PLAN_PLATA');
          setCompanyName(u.companyName || '');
          setCompanyRuc(u.companyRuc || '');
          setDigesaRegistryCode(u.digesaRegistryCode || '');
          setOriginRegion(u.originRegion || 'Cusco');
          setSelectedCerts(u.qualityCertificates || []);
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleToggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          dni,
          phone,
          address,
          preferredPaymentMethod,
          consumerPlan,
          producerPlan,
          companyName,
          companyRuc,
          digesaRegistryCode,
          qualityCertificates: selectedCerts,
          originRegion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil.');
      }

      setSuccessMessage('¡Tus datos han sido actualizados con éxito en ALTOQ PE!');
      await refreshUser();
      if (data.user) {
        setProfile(data.user);
      }
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshUser();
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F3EB]">
        <MarketplaceNavbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#0F3D2E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F3EB]">
        <MarketplaceNavbar />
        <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 bg-brand-surface-soft border border-brand-primary/20 rounded-full flex items-center justify-center mx-auto text-brand-primary">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-brand-primary">Accede a tu Perfil</h1>
            <p className="text-xs text-brand-text-muted">
              Inicia sesión o regístrate en ALTOQ PE para gestionar tus direcciones de despacho en Lima, consultar tus pedidos y administrar tu plan de suscripción.
            </p>
          </div>
          <Link
            href="/login?redirectTo=/perfil"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0F3D2E] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#18523f] transition-colors shadow-sm"
          >
            <span>Iniciar Sesión en ALTOQ PE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
      </div>
    );
  }

  const roleTitleMap: Record<UserRole, string> = {
    CONSUMER_RETAIL: 'Consumidor Minorista (B2C)',
    CONSUMER_WHOLESALE: 'Consumidor Mayorista HORECA (B2B)',
    PRODUCER: 'Proveedor Agroindustrial',
    ADMIN: 'Administrador',
    SUPERADMIN: 'Superadmin de Gobernanza',
  };

  const initials = `${(profile.firstName || 'A')[0] || ''}${(profile.lastName || 'P')[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EB]">
      {/* 1. Header Oficial */}
      <MarketplaceNavbar />

      {/* 2. Migajas de Pan (Breadcrumbs) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-brand-text-muted">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="hover:text-brand-primary font-medium">Inicio</Link>
            <span>/</span>
            <span className="text-brand-primary font-bold">Mi Perfil</span>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 text-red-700 hover:text-red-900 font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* 3. Contenedor Principal del Perfil */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Tarjeta de Identidad Superior */}
        <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-[#8BAA52]">
              {initials || 'AQ'}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-brand-primary">
                  {profile.firstName ? `${profile.firstName} ${profile.lastName}` : profile.companyName || 'Usuario ALTOQ PE'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {roleTitleMap[profile.role]}
                </span>
              </div>
              <div className="text-xs text-brand-text-muted flex items-center space-x-3 mt-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{profile.email}</span>
                </span>
                {profile.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Accesos Rápidos según Rol */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {(profile.role === 'CONSUMER_RETAIL' || profile.role === 'CONSUMER_WHOLESALE') && (
              <button
                type="button"
                onClick={() => setIsOrdersOpen(true)}
                className="px-4 py-2 bg-brand-surface-soft hover:bg-gray-200 text-brand-primary font-bold text-xs rounded-brand-md transition-colors flex items-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mis Pedidos</span>
              </button>
            )}

            {profile.role === 'CONSUMER_WHOLESALE' && (
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-brand-md transition-colors shadow-sm"
              >
                Cotizaciones B2B
              </button>
            )}

            {profile.role === 'PRODUCER' && (
              <Link
                href="/producer"
                className="px-4 py-2 bg-[#D85A2F] hover:bg-[#b84822] text-white font-bold text-xs rounded-brand-md transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Panel de Productor</span>
              </Link>
            )}

            {profile.role === 'SUPERADMIN' && (
              <Link
                href="/superadmin"
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-brand-md transition-colors shadow-sm"
              >
                Panel de Gobernanza
              </Link>
            )}
          </div>
        </div>

        {/* Tarjetas de Métricas de Beneficios (Para Consumidores) */}
        {(profile.role === 'CONSUMER_RETAIL' || profile.role === 'CONSUMER_WHOLESALE') && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Filipuntos Acumulados</span>
                <strong className="text-lg font-black text-brand-primary">{profile.filipuntosBalance} pts</strong>
              </div>
            </div>

            <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">ALTOQ Créditos (Garantía)</span>
                <strong className="text-lg font-black text-brand-primary">S/ {profile.altoqCreditsBalance.toFixed(2)}</strong>
              </div>
            </div>

            <div className="bg-white border border-brand-primary/10 rounded-brand-lg p-4 shadow-sm flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                consumerPlan === 'PLAN_ORO' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <Star className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Suscripción Activa</span>
                <strong className="text-xs font-black text-brand-primary">
                  {consumerPlan === 'PLAN_ORO' ? 'Plan Oro ($15/mes)' : 'Plan Gratuito ($0/mes)'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Mensajes de Estado */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-brand-md text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-brand-md text-xs text-red-700 font-bold flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario de Edición de Perfil */}
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* SECCIÓN 1: DATOS PERSONALES Y DESPACHO */}
          <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-brand-primary uppercase tracking-wide">
                  1. Información de Contacto y Despacho en Lima
                </h2>
                <p className="text-[11px] text-brand-text-muted">
                  Actualiza tus datos para la entrega de alimentos liofilizados con courier autorizado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">Nombres *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">Apellidos *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">DNI / Documento *</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">Teléfono Móvil (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-primary mb-1">Dirección de Entrega en Lima *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Av. Javier Prado Este 2450, Dpto 401, San Borja, Lima"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-primary mb-1">Método de Pago Preferido</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredPaymentMethod('YAPE_PLIN')}
                    className={`p-2.5 rounded-brand-md border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      preferredPaymentMethod === 'YAPE_PLIN'
                        ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Yape / Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredPaymentMethod('TARJETA_CULQI')}
                    className={`p-2.5 rounded-brand-md border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      preferredPaymentMethod === 'TARJETA_CULQI'
                        ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Tarjeta de Crédito / Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredPaymentMethod('TRANSFERENCIA_BCP')}
                    className={`p-2.5 rounded-brand-md border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      preferredPaymentMethod === 'TRANSFERENCIA_BCP'
                        ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Transferencia Bancaria</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PLAN DE SUSCRIPCIÓN (COMPRADORES) */}
          {(profile.role === 'CONSUMER_RETAIL' || profile.role === 'CONSUMER_WHOLESALE') && (
            <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-extrabold text-brand-primary uppercase tracking-wide">
                  2. Plan de Suscripción de Comprador
                </h2>
                <p className="text-[11px] text-brand-text-muted">
                  Puedes actualizar tu plan en cualquier momento para obtener un 10% de descuento en el catálogo y recetas express.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plan Gratuito */}
                <div
                  onClick={() => setConsumerPlan('PLAN_GRATUITO')}
                  className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between ${
                    consumerPlan === 'PLAN_GRATUITO'
                      ? 'border-[#0F3D2E] bg-emerald-50/50 ring-2 ring-[#0F3D2E]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs text-brand-primary">Plan Gratuito</h3>
                      <span className="font-bold text-xs text-gray-700">$0 / mes (15 dias de prueba)</span>
                    </div>
                    <ul className="text-[11px] text-gray-600 space-y-1.5 mt-2.5">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Acceso al catálogo completo y precios</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Garantía DIGESA y protección de humedad</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                    <span className={`text-[11px] font-bold ${consumerPlan === 'PLAN_GRATUITO' ? 'text-brand-primary' : 'text-gray-400'}`}>
                      {consumerPlan === 'PLAN_GRATUITO' ? 'Plan Activo' : 'Seleccionar'}
                    </span>
                  </div>
                </div>

                {/* Plan Oro Comprador */}
                <div
                  onClick={() => setConsumerPlan('PLAN_ORO')}
                  className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between relative ${
                    consumerPlan === 'PLAN_ORO'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/30'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Más Popular
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs text-amber-950 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        <span>Plan Oro</span>
                      </h3>
                      <span className="font-bold text-xs text-amber-950">$15 / mes</span>
                    </div>
                    <ul className="text-[11px] text-amber-950 space-y-1.5 mt-2.5 font-medium">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Descuento exclusivo del 10% en catálogo</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Recetas express en video (3 minutos)</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Acumulación de Filipuntos para canjes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200 text-center">
                    <span className={`text-[11px] font-bold ${consumerPlan === 'PLAN_ORO' ? 'text-amber-900' : 'text-gray-400'}`}>
                      {consumerPlan === 'PLAN_ORO' ? 'Plan Activo' : 'Seleccionar'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 2 PROVEEDORES: PLAN DE PROVEEDOR ($7 / $15) */}
          {profile.role === 'PRODUCER' && (
            <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-extrabold text-brand-primary uppercase tracking-wide">
                  2. Plan de Suscripción para Proveedor Agroindustrial
                </h2>
                <p className="text-[11px] text-brand-text-muted">
                  Precios oficiales idénticos a los presentados en el landing corporativo de ALTOQ PE.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plan Plata */}
                <div
                  onClick={() => setProducerPlan('PLAN_PLATA')}
                  className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between ${
                    producerPlan === 'PLAN_PLATA'
                      ? 'border-[#0F3D2E] bg-emerald-50/50 ring-2 ring-[#0F3D2E]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs text-brand-primary">Plan Plata</h3>
                      <span className="font-bold text-xs text-gray-700">$7 / mes</span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 mt-0.5">15 días de prueba gratis</div>
                    <ul className="text-[11px] text-gray-600 space-y-1.5 mt-2.5">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Perfil empresarial verificado</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Publicación de hasta 3 productos</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                    <span className={`text-[11px] font-bold ${producerPlan === 'PLAN_PLATA' ? 'text-brand-primary' : 'text-gray-400'}`}>
                      {producerPlan === 'PLAN_PLATA' ? 'Plan Activo' : 'Seleccionar Plan Plata'}
                    </span>
                  </div>
                </div>

                {/* Plan Oro Productor */}
                <div
                  onClick={() => setProducerPlan('PLAN_ORO')}
                  className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between relative ${
                    producerPlan === 'PLAN_ORO'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/30'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Más Popular
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs text-amber-950 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        <span>Plan Oro</span>
                      </h3>
                      <span className="font-bold text-xs text-amber-950">$15 / mes</span>
                    </div>
                    <div className="text-[10px] font-bold text-amber-800 mt-0.5">Acceso y publicación ilimitada</div>
                    <ul className="text-[11px] text-amber-950 space-y-1.5 mt-2.5 font-medium">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Publicación ilimitada de catálogo</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Promoción destacada en campañas B2C/B2B</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200 text-center">
                    <span className={`text-[11px] font-bold ${producerPlan === 'PLAN_ORO' ? 'text-amber-900' : 'text-gray-400'}`}>
                      {producerPlan === 'PLAN_ORO' ? 'Plan Activo' : 'Seleccionar Plan Oro'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3: DATOS ESPECÍFICOS DE EMPRESA / PROVEEDOR */}
          {(profile.role === 'CONSUMER_WHOLESALE' || profile.role === 'PRODUCER') && (
            <div className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-extrabold text-brand-primary uppercase tracking-wide">
                  3. Datos de Empresa y Registros Sanitarios
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">Razón Social *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">RUC *</label>
                  <input
                    type="text"
                    value={companyRuc}
                    onChange={(e) => setCompanyRuc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                  />
                </div>

                {profile.role === 'PRODUCER' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-brand-primary mb-1">Código Registro DIGESA *</label>
                      <input
                        type="text"
                        value={digesaRegistryCode}
                        onChange={(e) => setDigesaRegistryCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-primary mb-1">Región de Origen *</label>
                      <input
                        type="text"
                        value={originRegion}
                        onChange={(e) => setOriginRegion(e.target.value)}
                        placeholder="Cusco, Junín, Puno, etc."
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-brand-primary">Certificados de Calidad e Inocuidad</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['HACCP', 'BPM', 'Orgánico Perú', 'Fair Trade'].map((cert) => (
                          <button
                            key={cert}
                            type="button"
                            onClick={() => handleToggleCert(cert)}
                            className={`p-2 rounded-brand-md border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                              selectedCerts.includes(cert)
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cert}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Botón de Guardar Cambios */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0F3D2E] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#18523f] transition-colors shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando cambios...' : 'Guardar Datos del Perfil'}</span>
            </button>

            <Link
              href="/"
              className="text-xs font-bold text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              Regresar al Catálogo del Marketplace
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <MarketplaceProvider>
      <PerfilContent />
    </MarketplaceProvider>
  );
}
