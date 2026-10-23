'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Role as UserRole, PaymentMethod } from '@/types';
import {
  ShoppingBag,
  Building2,
  Package,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  User,
  Star,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de Formulario de Registro
  const [selectedRole, setSelectedRole] = useState<UserRole>('CONSUMER_RETAIL');
  const [selectedPlan, setSelectedPlan] = useState<'PLAN_GRATUITO' | 'PLAN_ORO'>('PLAN_ORO');
  const [producerPlan, setProducerPlan] = useState<'PLAN_PLATA' | 'PLAN_ORO'>('PLAN_ORO');

  // Campos comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Campos Consumidor (Mayorista y Minorista)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>('YAPE_PLIN');

  // Campos Empresa / Mayorista / Proveedor
  const [companyName, setCompanyName] = useState('');
  const [companyRuc, setCompanyRuc] = useState('');

  // Campos Proveedor
  const [originRegion, setOriginRegion] = useState('Cusco');
  const [digesaRegistryCode, setDigesaRegistryCode] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>([
    'BPM DIGESA',
    'HACCP Codex Alimentarius'
  ]);
  const [maxOctagonsAffidavit, setMaxOctagonsAffidavit] = useState(false);

  // Toggle de certificados de calidad
  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };



  // Iniciar Sesión con Formulario Real
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      let targetPath = redirectTo;
      if (redirectTo === '/') {
        if (data.user?.role === 'CONSUMER_WHOLESALE') targetPath = '/mayorista';
        else if (data.user?.role === 'PRODUCER') targetPath = '/producer';
        else if (data.user?.role === 'SUPERADMIN') targetPath = '/superadmin';
        else targetPath = '/';
      }

      router.push(targetPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Registro Real
  const handleStandardRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        role: selectedRole,
        email,
        password,
        firstName,
        lastName,
        dni,
        phone,
        address,
        preferredPaymentMethod,
        consumerPlan: selectedPlan,
        companyName,
        companyRuc,
        digesaRegistryCode,
        qualityCertificates: selectedCerts,
        maxOctagonsAffidavit,
        originRegion,
        producerPlan,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      router.push(redirectTo);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al completar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EB] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Tarjeta Principal de Autenticación */}
      <div className="max-w-2xl w-full bg-white rounded-brand-xl shadow-2xl border border-brand-primary/10 overflow-hidden">
        {/* Cabecera de Marca */}
        <div className="bg-[#0F3D2E] text-white p-6 sm:p-7 text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-black text-3xl tracking-tight">
              ALTOQ<span className="text-[#D85A2F]">.PE</span>
            </span>
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#8BAA52]">
              FOOD TECHNOLOGY
            </span>
          </Link>
          <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
            Marketplace Oficial de Alimentos Liofilizados del Perú • Inicia sesión o regístrate para acceder al catálogo personalizado
          </p>
        </div>

        {/* Pestañas: Iniciar Sesión / Crear Cuenta */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setErrorMessage(null);
            }}
            className={`py-3.5 text-center transition-colors ${
              activeTab === 'LOGIN'
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary font-extrabold shadow-sm'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REGISTER');
              setErrorMessage(null);
            }}
            className={`py-3.5 text-center transition-colors ${
              activeTab === 'REGISTER'
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary font-extrabold shadow-sm'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
          >
            Crear Cuenta Nueva
          </button>
        </div>

        {/* Mensaje de Error Si Ocurre */}
        {errorMessage && (
          <div className="m-6 mb-0 p-3.5 bg-red-50 border border-red-200 rounded-brand-md flex items-start space-x-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Contenido según Pestaña */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: INICIAR SESIÓN */}
          {activeTab === 'LOGIN' ? (
            <div className="space-y-6">
              {/* Formulario Estándar */}
              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0F3D2E] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#18523f] transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Ingresar al Marketplace'}
                </button>
              </form>
            </div>
          ) : (
            /* TAB 2: CREAR CUENTA NUEVA */
            <form onSubmit={handleStandardRegister} className="space-y-6">
              {/* Paso 1: Tipo de Usuario */}
              <div>
                <label className="block text-xs font-extrabold text-brand-primary uppercase tracking-wide mb-2">
                  1. ¿Cómo operarás en ALTOQ PE?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('CONSUMER_RETAIL')}
                    className={`p-3 rounded-brand-md border text-left transition-all ${
                      selectedRole === 'CONSUMER_RETAIL'
                        ? 'border-[#0F3D2E] bg-emerald-50/90 font-bold ring-2 ring-[#0F3D2E]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="font-bold text-brand-primary">Consumidor Minorista</div>
                    <div className="text-[10px] text-gray-500">Pouches individuales para hogar</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('CONSUMER_WHOLESALE')}
                    className={`p-3 rounded-brand-md border text-left transition-all ${
                      selectedRole === 'CONSUMER_WHOLESALE'
                        ? 'border-[#0F3D2E] bg-emerald-50/90 font-bold ring-2 ring-[#0F3D2E]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="font-bold text-brand-primary">Consumidor Mayorista</div>
                    <div className="text-[10px] text-gray-500">HORECA, restaurantes y tiendas</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('PRODUCER')}
                    className={`p-3 rounded-brand-md border text-left transition-all ${
                      selectedRole === 'PRODUCER'
                        ? 'border-[#D85A2F] bg-orange-50/90 font-bold ring-2 ring-[#D85A2F]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="w-4 h-4 text-[#D85A2F] mb-1" />
                    <div className="font-bold text-brand-primary">Proveedor</div>
                    <div className="text-[10px] text-gray-500">Empresa productora o cooperativa</div>
                  </button>
                </div>
              </div>

              {/* Paso 2: Formulario de Datos Reales según Rol */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <label className="block text-xs font-extrabold text-brand-primary uppercase tracking-wide">
                  2. Datos Reales de Registro
                </label>

                {/* A. CAMPOS DE CONSUMIDOR (MINORISTA Y MAYORISTA) */}
                {(selectedRole === 'CONSUMER_RETAIL' || selectedRole === 'CONSUMER_WHOLESALE') && (
                  <div className="space-y-3.5">
                    {/* Nombre y Apellidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Nombres del Comprador *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ej. Andrea"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Apellidos del Comprador *
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ej. Rodríguez García"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* DNI y Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          DNI (8 dígitos) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={8}
                          value={dni}
                          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                          placeholder="74892019"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Número de Teléfono / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+51 984 123 456"
                            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Correo Electrónico y Contraseña */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Correo Electrónico *
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="andrea@ejemplo.pe"
                            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Contraseña *
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dirección de Entrega en Lima */}
                    <div>
                      <label className="block text-xs font-bold text-brand-primary mb-1">
                        Dirección de Despacho en Lima *
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Av. Larco 743, Dpto 402, Miraflores, Lima"
                          className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Método de Pago Preferido */}
                    <div>
                      <label className="block text-xs font-bold text-brand-primary mb-1">
                        Método de Pago Preferido *
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <label
                          className={`p-2.5 rounded-brand-md border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            preferredPaymentMethod === 'YAPE_PLIN'
                              ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="YAPE_PLIN"
                            checked={preferredPaymentMethod === 'YAPE_PLIN'}
                            onChange={() => setPreferredPaymentMethod('YAPE_PLIN')}
                            className="sr-only"
                          />
                          <span className="font-extrabold text-[11px]">Yape / Plin</span>
                          <span className="text-[9px] text-gray-400">QR / Móvil</span>
                        </label>

                        <label
                          className={`p-2.5 rounded-brand-md border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            preferredPaymentMethod === 'TARJETA_CULQI'
                              ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="TARJETA_CULQI"
                            checked={preferredPaymentMethod === 'TARJETA_CULQI'}
                            onChange={() => setPreferredPaymentMethod('TARJETA_CULQI')}
                            className="sr-only"
                          />
                          <span className="font-extrabold text-[11px]">Tarjeta</span>
                          <span className="text-[9px] text-gray-400">Débito / Crédito</span>
                        </label>

                        <label
                          className={`p-2.5 rounded-brand-md border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            preferredPaymentMethod === 'ALTOQ_CREDITS'
                              ? 'border-[#0F3D2E] bg-emerald-50 text-brand-primary font-bold ring-1 ring-[#0F3D2E]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="ALTOQ_CREDITS"
                            checked={preferredPaymentMethod === 'ALTOQ_CREDITS'}
                            onChange={() => setPreferredPaymentMethod('ALTOQ_CREDITS')}
                            className="sr-only"
                          />
                          <span className="font-extrabold text-[11px]">Transferencia</span>
                          <span className="text-[9px] text-gray-400">BCP / Interbank</span>
                        </label>
                      </div>
                    </div>

                    {/* Campos Adicionales si es Mayorista B2B */}
                    {selectedRole === 'CONSUMER_WHOLESALE' && (
                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-brand-md space-y-3">
                        <div className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-900 flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Datos Tributarios de Facturación (Mayorista HORECA)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                              Razón Social de la Empresa *
                            </label>
                            <input
                              type="text"
                              required={selectedRole === 'CONSUMER_WHOLESALE'}
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Ej. Operadora Gastronómica Peruana S.A.C."
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                              RUC de la Empresa (11 dígitos) *
                            </label>
                            <input
                              type="text"
                              required={selectedRole === 'CONSUMER_WHOLESALE'}
                              maxLength={11}
                              value={companyRuc}
                              onChange={(e) => setCompanyRuc(e.target.value.replace(/\D/g, ''))}
                              placeholder="20608912341"
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none bg-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* B. CAMPOS DE PROVEEDOR (EMPRESA PRODUCTORA O COOPERATIVA) */}
                {selectedRole === 'PRODUCER' && (
                  <div className="space-y-4">
                    {/* Razón Social y RUC de la empresa productora o cooperativa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Razón Social de la Productora o Cooperativa *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Ej. Agroindustrias del Valle Sagrado"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          RUC de la Empresa (11 dígitos) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={11}
                          value={companyRuc}
                          onChange={(e) => setCompanyRuc(e.target.value.replace(/\D/g, ''))}
                          placeholder="20539102941"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Código de Registro Sanitario DIGESA vigente */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Código de Registro Sanitario DIGESA vigente *
                        </label>
                        <div className="relative">
                          <FileCheck className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            required
                            value={digesaRegistryCode}
                            onChange={(e) => setDigesaRegistryCode(e.target.value)}
                            placeholder="RSA-P2409821-LIMA"
                            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Región de Origen Agroindustrial *
                        </label>
                        <select
                          value={originRegion}
                          onChange={(e) => setOriginRegion(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none bg-white font-medium"
                        >
                          <option value="Cusco">Cusco (Sierra Sur)</option>
                          <option value="Junín">Junín (Sierra Central)</option>
                          <option value="Puno">Puno (Altiplano)</option>
                          <option value="San Martín">San Martín (Selva Alta)</option>
                          <option value="Ayacucho">Ayacucho</option>
                          <option value="Áncash">Áncash</option>
                        </select>
                      </div>
                    </div>

                    {/* Correo, Contraseña y Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Correo de Contacto *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ventas@productor.pe"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Contraseña *
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary mb-1">
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+51 984 999 111"
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-brand-md focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Constancia o certificados de calidad */}
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-brand-md space-y-2">
                      <label className="block text-xs font-bold text-brand-primary">
                        Constancias o Certificados de Calidad Disponibles:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {['BPM DIGESA', 'HACCP Codex Alimentarius', 'Certificación Orgánica', 'GLOBALG.A.P.'].map((cert) => {
                          const isChecked = selectedCerts.includes(cert);
                          return (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => toggleCert(cert)}
                              className={`p-2 rounded border text-left flex items-center space-x-1.5 transition-colors ${
                                isChecked
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                                  : 'border-gray-200 bg-white text-gray-600'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                                {isChecked && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="text-[10px] leading-tight">{cert}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Declaración Jurada o Matriz Nutricional (Máximo 2 octógonos) */}
                    <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-brand-md space-y-2">
                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={maxOctagonsAffidavit}
                          onChange={(e) => setMaxOctagonsAffidavit(e.target.checked)}
                          className="mt-0.5 rounded border-orange-300 text-[#D85A2F] focus:ring-[#D85A2F]"
                        />
                        <div className="text-[11px] text-orange-950 leading-relaxed">
                          <strong className="block text-xs text-[#D85A2F] mb-0.5">
                            Declaración Jurada y Cumplimiento Sanitario (Obligatorio)
                          </strong>
                          Certifico bajo juramento que los productos liofilizados comercializados en ALTOQ PE cumplen estrictamente con la política interna de <strong>máximo dos (2) octógonos</strong> según la Ley N° 30021, cuentan con empaque tricapa hermético para la humedad de Lima (&gt;80% HR), y acepto la penalidad de exclusión inmediata de la plataforma en caso de discrepancia nutricional o sanitaria.
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Paso 3: Selección de Suscripción para Compradores */}
              {(selectedRole === 'CONSUMER_RETAIL' || selectedRole === 'CONSUMER_WHOLESALE') && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-extrabold text-brand-primary uppercase tracking-wide">
                    3. Elige tu Plan de Comprador:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Plan Gratuito */}
                    <div
                      onClick={() => setSelectedPlan('PLAN_GRATUITO')}
                      className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between ${
                        selectedPlan === 'PLAN_GRATUITO'
                          ? 'border-[#0F3D2E] bg-gray-50 ring-2 ring-[#0F3D2E]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-xs text-brand-primary">Plan Gratuito</h4>
                          <span className="font-bold text-xs text-gray-700">$0 / mes</span>
                        </div>
                        <ul className="text-[11px] text-gray-600 space-y-1.5 mt-3">
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Acceso al catálogo completo de productos</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Comparación de precios y productores</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Solicitud de cotizaciones mayoristas</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Alertas de nuevos lotes y novedades</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                        <span className={`text-[11px] font-bold ${selectedPlan === 'PLAN_GRATUITO' ? 'text-brand-primary' : 'text-gray-400'}`}>
                          {selectedPlan === 'PLAN_GRATUITO' ? 'Seleccionado' : 'Elegir Plan Gratuito'}
                        </span>
                      </div>
                    </div>

                    {/* Plan Oro Comprador */}
                    <div
                      onClick={() => setSelectedPlan('PLAN_ORO')}
                      className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between relative ${
                        selectedPlan === 'PLAN_ORO'
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/30'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                        Más Popular
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-xs text-amber-950 flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                            <span>Plan Oro</span>
                          </h4>
                          <span className="font-bold text-xs text-amber-950">$15 / mes</span>
                        </div>
                        <ul className="text-[11px] text-amber-950 space-y-1.5 mt-3">
                          <li className="flex items-start space-x-1.5 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Todos los beneficios del plan gratuito</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Descuento exclusivo del 10% en catálogo</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Recetas express en video (3 minutos)</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Acumulación de Filipuntos para canjes</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Garantía de devolución con ALTOQ Créditos</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Prioridad en atención y despachos</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-amber-200 text-center">
                        <span className={`text-[11px] font-bold ${selectedPlan === 'PLAN_ORO' ? 'text-amber-900' : 'text-gray-400'}`}>
                          {selectedPlan === 'PLAN_ORO' ? 'Seleccionado' : 'Elegir Plan Oro'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Selección de Suscripción para Proveedores Agroindustriales */}
              {selectedRole === 'PRODUCER' && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-extrabold text-brand-primary uppercase tracking-wide">
                    3. Elige tu Plan de Proveedor en ALTOQ PE:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Plan Plata Productor */}
                    <div
                      onClick={() => setProducerPlan('PLAN_PLATA')}
                      className={`p-4 rounded-brand-md border cursor-pointer transition-all flex flex-col justify-between ${
                        producerPlan === 'PLAN_PLATA'
                          ? 'border-[#0F3D2E] bg-gray-50 ring-2 ring-[#0F3D2E]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-xs text-brand-primary">Plan Plata</h4>
                          <span className="font-bold text-xs text-gray-700">$7 / mes</span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-700 mt-0.5">15 días de prueba gratis</div>
                        <ul className="text-[11px] text-gray-600 space-y-1.5 mt-3">
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Crear perfil empresarial de productor</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Publicación de hasta 3 productos a la vez</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Mostrar precios, presentaciones y fichas técnicas</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Recepción de cotizaciones de compradores</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                        <span className={`text-[11px] font-bold ${producerPlan === 'PLAN_PLATA' ? 'text-brand-primary' : 'text-gray-400'}`}>
                          {producerPlan === 'PLAN_PLATA' ? 'Seleccionado' : 'Elegir Plan Plata'}
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
                          <h4 className="font-extrabold text-xs text-amber-950 flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                            <span>Plan Oro</span>
                          </h4>
                          <span className="font-bold text-xs text-amber-950">$15 / mes</span>
                        </div>
                        <div className="text-[10px] font-bold text-amber-800 mt-0.5">Acceso y publicación ilimitada</div>
                        <ul className="text-[11px] text-amber-950 space-y-1.5 mt-3">
                          <li className="flex items-start space-x-1.5 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Todos los beneficios del Plan Plata</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Publicación ilimitada de catálogo liofilizado</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Promoción destacada en catálogo y campañas</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Panel de control de stock y almacén en Lima</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                            <span>Soporte prioritario y asesoría técnica en empaque</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-amber-200 text-center">
                        <span className={`text-[11px] font-bold ${producerPlan === 'PLAN_ORO' ? 'text-amber-900' : 'text-gray-400'}`}>
                          {producerPlan === 'PLAN_ORO' ? 'Seleccionado' : 'Elegir Plan Oro'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Creación Real */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#0F3D2E] text-white font-extrabold text-xs rounded-brand-md hover:bg-[#18523f] transition-colors shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Registrando cuenta real...' : 'Crear Cuenta y Entrar al Marketplace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Pie de Ayuda */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          ¿Tienes dudas sobre compras corporativas o suministro agroindustrial?{' '}
          <a href="https://wa.me/51984123456" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold hover:underline">
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F3EB] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0F3D2E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
