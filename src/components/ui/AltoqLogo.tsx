import React from 'react';

interface AltoqLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'dark' | 'light';
  priority?: boolean;
}

/**
 * Logotipo Institucional Oficial de ALTOQ PE FOOD TECHNOLOGY
 * Utiliza el activo de marca oficial transparente extraído del manual de identidad corporativa.
 * Soporta variante clara para fondos oscuros (login, banner verde) y variante oscura para fondos blancos/crema.
 */
export const AltoqLogo: React.FC<AltoqLogoProps> = ({
  className = '',
  width = 185,
  height = 48,
  variant = 'dark',
  priority = true,
}) => {
  const isLight = variant === 'light';
  const logoSrc = isLight
    ? '/assets/branding/logo-altoq-white.png'
    : '/assets/branding/logo-altoq-transparent.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="ALTOQ PE - Food Technology"
        width={width}
        height={height}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: 'auto',
          maxHeight: typeof height === 'number' ? `${height}px` : height,
          objectFit: 'contain',
        }}
        className="block"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};
