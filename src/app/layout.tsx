import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-base',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'ALTOQ PE | E-commerce de Alimentos Liofilizados del Perú',
  description:
    'Plataforma FoodTech que conecta a productores peruanos de alimentos liofilizados e instantáneos con compradores B2C y B2B. Alimentos saludables con menos de 2 octógonos y garantía DIGESA.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F3D2E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable} ${montserrat.variable}`}>
      <body className="min-h-screen antialiased bg-brand-bg text-brand-text-main font-sans">
        {children}
      </body>
    </html>
  );
}
