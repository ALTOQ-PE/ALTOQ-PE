// ==============================================================================
// ALTOQ PE - CAPA DE PERSISTENCIA REAL (STORAGE SERVICE)
// Gestión de usuarios, perfiles, pedidos y productos reales
// REGLA ESTRICTA: Sin uso de emojis en código ni comentarios
// ==============================================================================

import fs from 'fs';
import path from 'path';
import type { Role as UserRole, ConsumerSubscriptionPlan, ProducerSubscriptionPlan, PaymentMethod } from '@/types';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  
  // Datos de Consumidor (Minorista y Mayorista)
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  address?: string;
  preferredPaymentMethod?: PaymentMethod;
  consumerPlan?: ConsumerSubscriptionPlan;
  filipuntosBalance?: number;
  altoqCreditsBalance?: number;

  // Datos específicos Mayorista B2B
  companyName?: string;
  companyRuc?: string;

  // Datos específicos Proveedor Agroindustrial
  producerPlan?: ProducerSubscriptionPlan;
  digesaRegistryCode?: string;
  qualityCertificates?: string[];
  maxOctagonsAffidavit?: boolean;
  originRegion?: string;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    pricePen: number;
    isBox?: boolean;
  }>;
  subtotalPen: number;
  shippingPen: number;
  creditsDiscountPen: number;
  totalPen: number;
  status: 'PAGO_VALIDADO' | 'ALISTADO_EN_SECO' | 'EN_RUTA_COURIER' | 'ENTREGADO';
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  contactPhone?: string;
  createdAt: string;
}

import type { WholesaleQuote } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'db.json');

interface DatabaseContent {
  users: StoredUser[];
  orders: StoredOrder[];
  quotes: WholesaleQuote[];
}

// Inicializar base de datos con usuarios y datos reales pre-cargados
const DEFAULT_DB: DatabaseContent = {
  users: [
    {
      id: 'usr-consumer-gold',
      email: 'andrea.rodriguez@altoq.pe',
      passwordHash: 'hashed_pass_123',
      role: 'CONSUMER_RETAIL',
      firstName: 'Andrea',
      lastName: 'Rodríguez',
      dni: '74892019',
      phone: '+51 984 123 456',
      address: 'Av. Larco 743, Dpto 402, Miraflores, Lima',
      preferredPaymentMethod: 'YAPE_PLIN',
      consumerPlan: 'PLAN_ORO',
      filipuntosBalance: 450,
      altoqCreditsBalance: 25.0,
      createdAt: '2026-10-20T10:00:00Z',
    },
    {
      id: 'usr-consumer-free',
      email: 'comprador.gratis@altoq.pe',
      passwordHash: 'hashed_pass_123',
      role: 'CONSUMER_RETAIL',
      firstName: 'Carlos',
      lastName: 'Fernández',
      dni: '45129834',
      phone: '+51 991 876 543',
      address: 'Calle Las Begonias 441, San Isidro, Lima',
      preferredPaymentMethod: 'TARJETA_CULQI',
      consumerPlan: 'PLAN_GRATUITO',
      filipuntosBalance: 0,
      altoqCreditsBalance: 0.0,
      createdAt: '2026-10-21T12:00:00Z',
    },
    {
      id: 'usr-wholesale',
      email: 'compras@horecandina.com',
      passwordHash: 'hashed_pass_123',
      role: 'CONSUMER_WHOLESALE',
      firstName: 'Miguel',
      lastName: 'Vargas',
      dni: '10928374',
      phone: '+51 972 345 678',
      address: 'Av. Salaverry 1280, Jesús María, Lima',
      preferredPaymentMethod: 'YAPE_PLIN',
      companyName: 'Operadora Gastronómica Peruana S.A.C.',
      companyRuc: '20608912341',
      consumerPlan: 'PLAN_ORO',
      filipuntosBalance: 1200,
      altoqCreditsBalance: 0.0,
      createdAt: '2026-10-18T09:00:00Z',
    },
    {
      id: 'usr-producer',
      email: 'ventas@vallesagradoagro.pe',
      passwordHash: 'hashed_pass_123',
      role: 'PRODUCER',
      companyName: 'Agroindustrias del Valle Sagrado',
      companyRuc: '20539102941',
      digesaRegistryCode: 'RSA-P2409821-LIMA',
      qualityCertificates: ['HACCP Codex Alimentarius', 'BPM DIGESA'],
      maxOctagonsAffidavit: true,
      originRegion: 'Cusco',
      producerPlan: 'PLAN_ORO',
      phone: '+51 984 999 111',
      createdAt: '2026-10-15T08:00:00Z',
    },
    {
      id: 'usr-superadmin',
      email: 'admin@altoq.pe',
      passwordHash: 'hashed_pass_superadmin',
      role: 'SUPERADMIN',
      firstName: 'Super',
      lastName: 'Admin',
      dni: '00000000',
      phone: '+51 900 000 000',
      createdAt: '2026-10-01T00:00:00Z',
    },
  ],
  orders: [],
  quotes: [],
};

function readDb(): DatabaseContent {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      orders: parsed.orders || [],
      quotes: parsed.quotes || [],
    };
  } catch (error) {
    console.error('Error leyendo base de datos local:', error);
    return DEFAULT_DB;
  }
}

function writeDb(data: DatabaseContent): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error escribiendo en base de datos local:', error);
  }
}

export const StorageService = {
  getUsers: (): StoredUser[] => {
    return readDb().users;
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = readDb().users;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id: string): StoredUser | undefined => {
    const users = readDb().users;
    return users.find((u) => u.id === id);
  },

  createUser: (userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser => {
    const db = readDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado en ALTOQ PE.');
    }

    const newUser: StoredUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      filipuntosBalance: userData.consumerPlan === 'PLAN_ORO' ? 50 : 0,
      altoqCreditsBalance: 0.0,
    };

    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  updateUserBalances: (
    userId: string,
    deltaFilipuntos: number,
    deltaCredits: number
  ): StoredUser | undefined => {
    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return undefined;

    const user = db.users[userIndex];
    user.filipuntosBalance = Math.max(0, (user.filipuntosBalance || 0) + deltaFilipuntos);
    user.altoqCreditsBalance = Math.max(0, (user.altoqCreditsBalance || 0) + deltaCredits);

    db.users[userIndex] = user;
    writeDb(db);
    return user;
  },

  createOrder: (orderData: Omit<StoredOrder, 'id' | 'orderNumber' | 'createdAt'>): StoredOrder => {
    const db = readDb();
    const orderNumber = `ALTOQ-2026-${String(db.orders.length + 101).padStart(4, '0')}`;
    const newOrder: StoredOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    writeDb(db);
    return newOrder;
  },

  getOrdersByUser: (userId: string): StoredOrder[] => {
    const db = readDb();
    return db.orders.filter((o) => o.userId === userId);
  },

  getAllOrders: (): StoredOrder[] => {
    const db = readDb();
    return db.orders;
  },

  updateOrderStatus: (
    orderId: string,
    status: StoredOrder['status']
  ): StoredOrder | undefined => {
    const db = readDb();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) return undefined;
    order.status = status;
    writeDb(db);
    return order;
  },

  createQuote: (quoteData: Omit<WholesaleQuote, 'id' | 'quoteNumber' | 'createdAt'>): WholesaleQuote => {
    const db = readDb();
    const quoteNumber = `COT-2026-${String((db.quotes?.length || 0) + 101).padStart(4, '0')}`;
    const newQuote: WholesaleQuote = {
      ...quoteData,
      id: `qte-${Date.now()}`,
      quoteNumber,
      createdAt: new Date().toISOString(),
    };

    if (!db.quotes) db.quotes = [];
    db.quotes.push(newQuote);
    writeDb(db);
    return newQuote;
  },

  getQuotesByUser: (userId: string): WholesaleQuote[] => {
    const db = readDb();
    return (db.quotes || []).filter((q) => q.userId === userId);
  },

  getAllQuotes: (): WholesaleQuote[] => {
    const db = readDb();
    return db.quotes || [];
  },
};
