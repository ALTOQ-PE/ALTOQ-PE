'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMarketplace } from './MarketplaceContext';
import { ShieldCheck, Sparkles, Clock, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

export const MarketplaceHero: React.FC = () => {
  const { currentRole } = useMarketplace();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      {/* Banner Principal Estilo Marketplace */}
      <div className="relative rounded-brand-xl overflow-hidden shadow-md bg-gradient-to-r from-brand-primary-dark via-brand-primary to-brand-primary-light text-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {currentRole === 'CONSUMER_WHOLESALE'
                  ? 'Abastecimiento Mayorista Directo de Planta Agroindustrial'
                  : currentRole === 'PRODUCER'
                  ? 'Plataforma Oficial de Ventas para Productores Peruanos'
                  : currentRole === 'SUPERADMIN'
                  ? 'Centro de Control Operativo y Gobernanza Sanitaria'
                  : 'Liofilizados Peruanos con &le; 2 Octógonos y Registro DIGESA'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {currentRole === 'CONSUMER_WHOLESALE' ? (
                <>
                  Lotes y Cajas Máster de <span className="text-brand-secondary-light">Alimentos Liofilizados</span>
                </>
              ) : (
                <>
                  Sabores Típicos del Perú <span className="text-brand-accent">Listos en 3 Minutos</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              {currentRole === 'CONSUMER_WHOLESALE'
                ? 'Precios escalonados ex-planta para hoteles, restaurantes y tiendas. Certificados sanitarios y fichas técnicas bromatológicas descargables al instante.'
                : 'Pechuga deshilachada, ají amarillo criollo y platos emblemáticos liofilizados a -40 °C. Conservan el 97% de nutrientes y rinden hasta 10 veces su peso al hidratarse.'}
            </p>

            {/* Badges de Atributos Clave */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-white/90">
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-brand-secondary-light" />
                <span>Listo en 3 min con agua caliente</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Empaque Tricapa Anti-Humedad (&gt;80% HR)</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5 text-brand-accent" />
                <span>Despacho Consolidado en Lima</span>
              </div>
            </div>
          </div>

          {/* Gráfico / Fotografía de Producto en Hero */}
          <div className="md:col-span-4 flex justify-center items-center">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white/10 p-4 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
              <img
                src="/assets/products/pouches-pack.png"
                alt="Pouches de Alimentos Liofilizados ALTOQ PE"
                className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
