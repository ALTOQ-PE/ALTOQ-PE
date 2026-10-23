import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F3D2E',
          'primary-light': '#18523f',
          'primary-dark': '#0a291f',
          secondary: '#8BAA52',
          'secondary-light': '#a4c468',
          'secondary-dark': '#6f8a3e',
          accent: '#D85A2F',
          'accent-hover': '#c04c23',
          'accent-light': '#fcece6',
          bg: '#F6F3EB',
          surface: '#FFFFFF',
          'surface-soft': '#EFECE3',
          'text-main': '#14221D',
          'text-muted': '#52635B',
          'text-light': '#83948C',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'brand-sm': '8px',
        'brand-md': '14px',
        'brand-lg': '22px',
        'brand-xl': '32px',
      },
    },
  },
  plugins: [],
};

export default config;
