'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role as UserRole, CatalogProduct, ProductReview } from '@/types';

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
  isWholesaleBox?: boolean;
}

import type { PaymentMethod } from '@/types';

export interface ActiveUserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  address?: string;
  preferredPaymentMethod?: PaymentMethod;
  consumerPlan?: 'PLAN_GRATUITO' | 'PLAN_ORO';
  filipuntosBalance: number;
  altoqCreditsBalance: number;
  companyName?: string;
  companyRuc?: string;
  digesaRegistryCode?: string;
  qualityCertificates?: string[];
  maxOctagonsAffidavit?: boolean;
  originRegion?: string;
  producerPlan?: 'PLAN_PLATA' | 'PLAN_ORO';
}

interface MarketplaceContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  consumerPlan: 'PLAN_GRATUITO' | 'PLAN_ORO';
  setConsumerPlan: (plan: 'PLAN_GRATUITO' | 'PLAN_ORO') => void;
  producerPlan: 'PLAN_PLATA' | 'PLAN_ORO';
  currentUser: ActiveUserProfile | null;
  refreshUser: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: CatalogProduct, quantity?: number, isWholesaleBox?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  isProducerModalOpen: boolean;
  setIsProducerModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedOctagons: number | null; // null: todos, 0: 0 octogonos, 1: max 1, 2: max 2
  setSelectedOctagons: (oct: number | null) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
  filipuntosBalance: number;
  altoqCreditsBalance: number;
  useAltoqCreditsDiscount: boolean;
  setUseAltoqCreditsDiscount: (use: boolean) => void;
  approvedProducts: CatalogProduct[];
  toggleProductApproval: (productId: string) => void;
  addProduct: (product: CatalogProduct) => void;
  getProductById: (id: string) => CatalogProduct | undefined;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// Lista inicial de productos oficiales de ALTOQ PE con galería, estrellas y reseñas reales
const INITIAL_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-001',
    producerId: 'prod-valle-sagrado',
    producerName: 'Agroindustrias del Valle Sagrado',
    originRegion: 'Cusco',
    commercialName: 'Ají de Gallina Liofilizado Tradicional',
    slug: 'aji-de-gallina-liofilizado-cusco',
    category: 'PLATO_TIPICO_LIOFILIZADO',
    isTrialPack: false,
    culturalContext:
      'Guiso emblemático cusqueño preparado con pechuga deshilachada de gallina criolla, ají amarillo tostado y caldo concentrado. Liofilizado a -40 °C para mantener su sabor y textura casera intactos.',
    ingredients: 'Pechuga de gallina criolla, ají amarillo, leche evaporada, nueces de la selva, especias andinas.',
    netWeightGrams: 45,
    rehydratedYieldGrams: 380, // 8.4x
    allergens: ['Lácteos', 'Nueces'],
    prepSteps: 'Abre el pouch, vierte 300 ml de agua caliente a 85 °C, reposa 3 minutos y sirve.',
    packagingPhotoUrl: '/assets/products/pouches-pack.png',
    dishPhotoUrl: '/assets/products/bowls-freeze-dried.png',
    galleryPhotos: [
      '/assets/products/pouches-pack.png',
      '/assets/products/bowls-freeze-dried.png',
      '/assets/products/box-delivery.png',
    ],
    rating: 4.9,
    reviewCount: 142,
    reviews: [
      {
        id: 'rev-001',
        userName: 'Mariana Quispe',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '18 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Sabor idéntico al hecho en casa, textura impecable',
        comment:
          'Me sorprendió que la pechuga de gallina conserva sus hebras y no queda pastosa. En solo 3 minutos con agua caliente del termo quedó listo en mi oficina. 100% recomendado.',
      },
      {
        id: 'rev-002',
        userName: 'Chef Ricardo Palacios',
        userRole: 'Comprador Verificado',
        rating: 5,
        date: '12 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Tecnología de liofilización superior',
        comment:
          'El punto de ají amarillo cusqueño y la cremosidad son exactos a la receta tradicional. Se nota la diferencia abismal contra la comida deshidratada convencional.',
      },
      {
        id: 'rev-003',
        userName: 'Elena Benavides',
        userRole: 'Minorista Gratuito',
        rating: 5,
        date: '04 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Perfecto para viajes y fines de semana',
        comment:
          'Lo llevé a una caminata a Huaraz. Pesa nada en la mochila (45 g) y al agregarle agua caliente rindió casi 400 g bien contundentes.',
      },
      {
        id: 'rev-004',
        userName: 'Gonzalo Beltrán',
        userRole: 'Minorista Oro',
        rating: 4,
        date: '28 de Septiembre, 2026',
        verifiedPurchase: true,
        title: 'Excelente sazón y practicidad',
        comment:
          'El sabor es extraordinario. Solo sugiero agregarle un poco de sal al gusto si prefieres comidas más intensas. Por lo demás, un 10.',
      },
    ],
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Tricapa foil sellado hermético (barrera vapor < 0.1 g/m²/d)',
    stockInLima: 48,
    wholesaleCostPen: 12.0,
    publicPricePen: 22.5,
    wholesalePricePen: 16.5,
    wholesaleMoqUnits: 24, // Caja máster x 24
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-P2409821-LIMA',
    qualityCertificatesUrls: ['/certs/haccp-cusco.pdf'],
    octagonCount: 1,
    octagonTypes: ['ALTO_EN_SODIO'],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-002',
    producerId: 'prod-bio-junin',
    producerName: 'BioAlimentos de Junín',
    originRegion: 'Junín',
    commercialName: 'Sopa Criolla con Carne Mechada y Fideos',
    slug: 'sopa-criolla-liofilizada-junin',
    category: 'SOPA_INSTANTANEA',
    isTrialPack: false,
    culturalContext:
      'Reconfortante caldo tradicional de la sierra central con carne vacuna deshebrada, fideos fortificados, ají panca secado al sol y orégano de Tarma.',
    ingredients: 'Carne de res mechada, fideos fortificados, ají panca, leche, orégano de Tarma, huevo pasteurizado.',
    netWeightGrams: 50,
    rehydratedYieldGrams: 420, // 8.4x
    allergens: ['Gluten', 'Lácteos'],
    prepSteps: 'Añade 350 ml de agua hirviendo directo al pouch. Espera 3 minutos y revuelve.',
    packagingPhotoUrl: '/assets/products/pouches-pack.png',
    dishPhotoUrl: '/assets/products/bowls-freeze-dried.png',
    galleryPhotos: [
      '/assets/products/pouches-pack.png',
      '/assets/products/bowls-freeze-dried.png',
      '/assets/products/box-delivery.png',
    ],
    rating: 4.8,
    reviewCount: 98,
    reviews: [
      {
        id: 'rev-005',
        userName: 'Lucía Fernández',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '15 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Reconfortante y sin octógonos',
        comment:
          'Increíble que tenga 0 octógonos y un sabor tan casero. La carne mechada se rehidrata en segundos y el orégano de Tarma le da el toque perfecto.',
      },
      {
        id: 'rev-006',
        userName: 'Ing. Walter Córdova',
        userRole: 'Comprador Verificado',
        rating: 5,
        date: '08 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Ideal para guardia nocturna',
        comment:
          'Trabajo turnos de noche en clínica y tener una sopa caliente de verdad en 3 minutos sin preservantes químicos es un salvavidas.',
      },
      {
        id: 'rev-007',
        userName: 'Carmen Rosa Morales',
        userRole: 'Minorista Gratuito',
        rating: 4,
        date: '25 de Septiembre, 2026',
        verifiedPurchase: true,
        title: 'Muy rica y natural',
        comment:
          'Los fideos quedan al dente y el caldito es sustancioso. Buen rendimiento por plato.',
      },
    ],
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Tricapa metalizada anti-humedad (>80% HR Lima)',
    stockInLima: 35,
    wholesaleCostPen: 10.5,
    publicPricePen: 19.9,
    wholesalePricePen: 14.5,
    wholesaleMoqUnits: 24,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-N8923019-DIGESA',
    qualityCertificatesUrls: ['/certs/bpm-junin.pdf'],
    octagonCount: 0, // 0 octogonos: 100% natural
    octagonTypes: [],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-003',
    producerId: 'prod-puno-altiplano',
    producerName: 'Cooperativa Alto Andina Puno',
    originRegion: 'Puno',
    commercialName: 'Pack Degustación 4 Sabores del Altiplano',
    slug: 'pack-degustacion-liofilizados-puno',
    category: 'PACK_PRUEBA',
    isTrialPack: true,
    culturalContext:
      'Caja de experiencia sensorial con 4 raciones liofilizadas individuales: Peshque de quinua real, crema de habas tostadas, charqui deshilachado y snack de arándanos liofilizados.',
    ingredients: 'Quinua perlada, queso andino, habas secas, carne de alpaca curada, arándanos liofilizados.',
    netWeightGrams: 160,
    rehydratedYieldGrams: 900,
    allergens: ['Lácteos'],
    prepSteps: 'Elige tu porción e hidrata con agua caliente en 3 minutos.',
    packagingPhotoUrl: '/assets/products/box-delivery.png',
    dishPhotoUrl: '/assets/products/pouches-pack.png',
    galleryPhotos: [
      '/assets/products/box-delivery.png',
      '/assets/products/pouches-pack.png',
      '/assets/products/bowls-freeze-dried.png',
    ],
    rating: 5.0,
    reviewCount: 215,
    reviews: [
      {
        id: 'rev-008',
        userName: 'Rodrigo San Martín',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '17 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'La mejor forma de conocer la liofilización andina',
        comment:
          'Vienen 4 variedades muy bien empacadas en su caja rígida. El peshque de quinua y el charqui son fuera de serie.',
      },
      {
        id: 'rev-009',
        userName: 'Patricia Alva',
        userRole: 'Compradora Verificada',
        rating: 5,
        date: '10 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Calidad de exportación',
        comment:
          'El empaque es muy seguro para la humedad de Lima. Los 4 sabores son deliciosos y rinden un montón.',
      },
      {
        id: 'rev-010',
        userName: 'Jorge Luis Mendoza',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '02 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Excelente relación calidad precio',
        comment:
          'Rinde casi un kilo servido entre las 4 raciones. Mis hijos quedaron fascinados con los snacks y el sabor tradicional.',
      },
    ],
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Empaque rígido secundario anti-impacto con pouches tricapa individuales',
    stockInLima: 62,
    wholesaleCostPen: 25.0,
    publicPricePen: 44.9,
    wholesalePricePen: 35.0,
    wholesaleMoqUnits: 12,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-H1029384-PUNO',
    qualityCertificatesUrls: ['/certs/haccp-puno.pdf'],
    octagonCount: 0,
    octagonTypes: [],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-004',
    producerId: 'prod-valle-sagrado',
    producerName: 'Agroindustrias del Valle Sagrado',
    originRegion: 'Cusco',
    commercialName: 'Carapulcra con Panceta y Papa Seca Criolla',
    slug: 'carapulcra-liofilizada-cusco',
    category: 'PLATO_TIPICO_LIOFILIZADO',
    isTrialPack: false,
    culturalContext:
      'El guiso más antiguo del Perú elaborado con papa seca tostada, maní molido, especias aromáticas y panceta de cerdo crocante liofilizada.',
    ingredients: 'Papa seca andina, panceta de cerdo, maní tostado, ají panca, ajo, canela y clavo.',
    netWeightGrams: 55,
    rehydratedYieldGrams: 450,
    allergens: ['Maní'],
    prepSteps: 'Añade 320 ml de agua caliente, reposa 3 minutos y mezcla bien antes de servir.',
    packagingPhotoUrl: '/assets/products/pouches-pack.png',
    dishPhotoUrl: '/assets/products/bowls-freeze-dried.png',
    galleryPhotos: [
      '/assets/products/pouches-pack.png',
      '/assets/products/bowls-freeze-dried.png',
      '/assets/products/box-delivery.png',
    ],
    rating: 4.8,
    reviewCount: 76,
    reviews: [
      {
        id: 'rev-011',
        userName: 'Fernando Chauca',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '14 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Sabor ahumado y panceta crujiente',
        comment:
          'La papa seca andina absorbe el agua caliente y queda con la textura justa, ni dura ni deshecha. El sabor a maní tostado y ají panca está en su punto.',
      },
      {
        id: 'rev-012',
        userName: 'Gabriela Vega',
        userRole: 'Compradora Verificada',
        rating: 5,
        date: '06 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Plato criollo auténtico',
        comment:
          'Se siente la dedicación de los productores de Cusco. Es un guiso espeso y contundente, perfecto para un almuerzo rápido.',
      },
      {
        id: 'rev-013',
        userName: 'Diego Salazar',
        userRole: 'Minorista Gratuito',
        rating: 4,
        date: '21 de Septiembre, 2026',
        verifiedPurchase: true,
        title: 'Muy buen guiso',
        comment:
          'Bastante generoso en la porción de panceta liofilizada. Acompañado de arroz queda de restaurante.',
      },
    ],
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Tricapa hermética con barrera de vapor < 0.1 g/m²/d',
    stockInLima: 30,
    wholesaleCostPen: 14.0,
    publicPricePen: 24.9,
    wholesalePricePen: 18.0,
    wholesaleMoqUnits: 24,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-C9928120-CUSCO',
    qualityCertificatesUrls: ['/certs/bpm-cusco.pdf'],
    octagonCount: 2, // Limite permitido: exactamente 2 octogonos
    octagonTypes: ['ALTO_EN_SODIO', 'ALTO_EN_GRASAS_SATURADAS'],
    healthPolicyAccepted: true,
  },
  {
    id: 'prod-005',
    producerId: 'prod-amazonas-tarwi',
    producerName: 'Chachapoyas Biofoods',
    originRegion: 'San Martín',
    commercialName: 'Snack de Mango Criollo y Aguaymanto Liofilizado',
    slug: 'snack-mango-aguaymanto-liofilizado',
    category: 'SNACK_LIOFILIZADO',
    isTrialPack: false,
    culturalContext:
      'Frutas amazónicas seleccionadas liofilizadas al vacío sin azúcares añadidos ni conservantes. Textura ultra crujiente lista para comer directamente.',
    ingredients: 'Mango criollo liofilizado (60%), aguaymanto silvestre liofilizado (40%).',
    netWeightGrams: 30,
    rehydratedYieldGrams: 280,
    allergens: [],
    prepSteps: 'Consumo directo como snack crujiente o agrégalo a yogures y ensaladas.',
    packagingPhotoUrl: '/assets/products/pouches-pack.png',
    dishPhotoUrl: '/assets/products/bowls-freeze-dried.png',
    galleryPhotos: [
      '/assets/products/pouches-pack.png',
      '/assets/products/bowls-freeze-dried.png',
      '/assets/products/box-delivery.png',
    ],
    rating: 4.9,
    reviewCount: 112,
    reviews: [
      {
        id: 'rev-014',
        userName: 'Andrea Bustamante',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '19 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Crocante adictivo y 100% fruta real',
        comment:
          'No tiene azúcar añadida y el sabor es dulce natural concentrado. El aguaymanto tiene ese toque ácido que contrasta perfecto con el mango.',
      },
      {
        id: 'rev-015',
        userName: 'Dr. Manuel Ríos',
        userRole: 'Comprador Verificado',
        rating: 5,
        date: '11 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Snack saludable sin sellos',
        comment:
          '0 octógonos, pura fruta peruana de la selva liofilizada. Se lo pongo al yogurt griego todos los días.',
      },
      {
        id: 'rev-016',
        userName: 'Sofía Paredes',
        userRole: 'Minorista Oro',
        rating: 5,
        date: '03 de Octubre, 2026',
        verifiedPurchase: true,
        title: 'Textura crocante insuperable',
        comment:
          'Parece una galleta pero es pura fruta. No vuelve a ponerse húmedo si cierras bien el pouch con su zipper.',
      },
    ],
    youtubeRecipeUrl: 'dQw4w9WgXcQ',
    packagingBarrierType: 'Pouch tricapa aluminio sellado al vacío',
    stockInLima: 85,
    wholesaleCostPen: 7.5,
    publicPricePen: 14.9,
    wholesalePricePen: 10.5,
    wholesaleMoqUnits: 30,
    isExclusiveGold: false,
    commissionPercentage: 15.0,
    digesaCode: 'RSA-A4401928-SANMARTIN',
    qualityCertificatesUrls: ['/certs/organico-peru.pdf'],
    octagonCount: 0,
    octagonTypes: [],
    healthPolicyAccepted: true,
  },
];

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ActiveUserProfile | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('CONSUMER_RETAIL');
  const [consumerPlan, setConsumerPlan] = useState<'PLAN_GRATUITO' | 'PLAN_ORO'>('PLAN_ORO');
  const [producerPlan] = useState<'PLAN_PLATA' | 'PLAN_ORO'>('PLAN_ORO');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isProducerModalOpen, setIsProducerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [selectedOctagons, setSelectedOctagons] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('TODAS');
  const [filipuntosBalance, setFilipuntosBalance] = useState(450);
  const [altoqCreditsBalance, setAltoqCreditsBalance] = useState(25.0);
  const [useAltoqCreditsDiscount, setUseAltoqCreditsDiscount] = useState(false);
  const [approvedProducts, setApprovedProducts] = useState<CatalogProduct[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('altoq_marketplace_products');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Error al cargar productos guardados:', err);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Guardar en localStorage cuando cambian los productos o reseñas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('altoq_marketplace_products', JSON.stringify(approvedProducts));
      } catch (err) {
        console.error('Error al persistir productos:', err);
      }
    }
  }, [approvedProducts]);

  // Cargar usuario autenticado real desde /api/auth/me
  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          if (data.user.consumerPlan) {
            setConsumerPlan(data.user.consumerPlan);
          }
          setFilipuntosBalance(data.user.filipuntosBalance ?? 0);
          setAltoqCreditsBalance(data.user.altoqCreditsBalance ?? 0);
        }
      }
    } catch (err) {
      console.error('Error al sincronizar perfil de usuario:', err);
    }
  };

  // Leer y sincronizar cookie de rol y plan al montar
  useEffect(() => {
    refreshUser();

    const cookies = document.cookie.split('; ');
    const roleCookie = cookies.find((row) => row.startsWith('altoq-user-role='))?.split('=')[1];
    if (roleCookie && ['CONSUMER_RETAIL', 'CONSUMER_WHOLESALE', 'PRODUCER', 'SUPERADMIN'].includes(roleCookie)) {
      setCurrentRole(roleCookie as UserRole);
    }

    const planCookie = cookies.find((row) => row.startsWith('altoq-consumer-plan='))?.split('=')[1];
    if (planCookie && ['PLAN_GRATUITO', 'PLAN_ORO'].includes(planCookie)) {
      setConsumerPlan(planCookie as 'PLAN_GRATUITO' | 'PLAN_ORO');
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    document.cookie = `altoq-user-role=${role}; path=/; max-age=86400`;
    document.cookie = `altoq-session-token=demo-token-${role}; path=/; max-age=86400`;
    refreshUser();
  };

  const handleSetConsumerPlan = (plan: 'PLAN_GRATUITO' | 'PLAN_ORO') => {
    setConsumerPlan(plan);
    document.cookie = `altoq-consumer-plan=${plan}; path=/; max-age=86400`;
  };

  const addToCart = (product: CatalogProduct, quantity = 1, isWholesaleBox = false) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.isWholesaleBox === isWholesaleBox
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isWholesaleBox === isWholesaleBox
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isWholesaleBox }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleProductApproval = (productId: string) => {
    setApprovedProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, healthPolicyAccepted: !prod.healthPolicyAccepted } : prod
      )
    );
  };

  const addProduct = (product: CatalogProduct) => {
    setApprovedProducts((prev) => [product, ...prev]);
  };

  const getProductById = (id: string): CatalogProduct | undefined => {
    return approvedProducts.find((p) => p.id === id || p.slug === id);
  };

  const addProductReview = (productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
    };

    setApprovedProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const currentReviews = prod.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const newCount = updatedReviews.length;
        const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const newRating = Number((sum / newCount).toFixed(1));
        return {
          ...prod,
          reviews: updatedReviews,
          reviewCount: newCount,
          rating: newRating,
        };
      })
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setRole: handleSetRole,
        consumerPlan,
        setConsumerPlan: handleSetConsumerPlan,
        producerPlan,
        currentUser,
        refreshUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        isProducerModalOpen,
        setIsProducerModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedOctagons,
        setSelectedOctagons,
        selectedRegion,
        setSelectedRegion,
        filipuntosBalance,
        altoqCreditsBalance,
        useAltoqCreditsDiscount,
        setUseAltoqCreditsDiscount,
        approvedProducts,
        toggleProductApproval,
        addProduct,
        getProductById,
        addProductReview,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace debe usarse dentro de MarketplaceProvider');
  }
  return context;
};
