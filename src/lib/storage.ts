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

// Inicializar base de datos con usuarios y datos reales de cada tipo
const DEFAULT_DB: DatabaseContent = {
  users: [
    {
      id: 'usr_c8192a4f_min_gold',
      email: 'consumidormin@gmail.com',
      passwordHash: 'hash_123',
      role: 'CONSUMER_RETAIL',
      firstName: 'Carlos',
      lastName: 'Mendoza Vega',
      dni: '45892147',
      phone: '+51 987 654 321',
      address: 'Jr. San Martín 420, Dpto 301, Magdalena del Mar, Lima',
      preferredPaymentMethod: 'YAPE_PLIN',
      consumerPlan: 'PLAN_ORO',
      filipuntosBalance: 450,
      altoqCreditsBalance: 25.0,
      createdAt: '2026-10-20T10:00:00Z',
    },
    {
      id: 'usr_d4710b9c_min_free',
      email: 'consumidormingratis@gmail.com',
      passwordHash: 'hash_123',
      role: 'CONSUMER_RETAIL',
      firstName: 'Andrea',
      lastName: 'Rodríguez Chumpitaz',
      dni: '74892019',
      phone: '+51 984 123 456',
      address: 'Av. José Larco 743, Dpto 402, Miraflores, Lima',
      preferredPaymentMethod: 'TARJETA_CULQI',
      consumerPlan: 'PLAN_GRATUITO',
      filipuntosBalance: 0,
      altoqCreditsBalance: 0.0,
      createdAt: '2026-10-21T12:00:00Z',
    },
    {
      id: 'usr_f9283e1a_wholesale',
      email: 'consumidormay@gmail.com',
      passwordHash: 'hash_123',
      role: 'CONSUMER_WHOLESALE',
      firstName: 'Mariana',
      lastName: 'Quispe Arrunátegui',
      dni: '10928374',
      phone: '+51 972 345 678',
      address: 'Av. Argentina 2850, Cercado de Lima, Lima',
      preferredPaymentMethod: 'TRANSFERENCIA_BCP',
      companyName: 'Distribuidora Gastronómica Los Andes S.A.C.',
      companyRuc: '20608912341',
      consumerPlan: 'PLAN_ORO',
      filipuntosBalance: 1200,
      altoqCreditsBalance: 0.0,
      createdAt: '2026-10-18T09:00:00Z',
    },
    {
      id: 'usr_e1094c3d_producer',
      email: 'proveedor@gmail.com',
      passwordHash: 'hash_123',
      role: 'PRODUCER',
      firstName: 'Roberto',
      lastName: 'Huamán Cárdenas',
      companyName: 'Cooperativa Agraria Agroindustrial Valle Sagrado Ltda.',
      companyRuc: '20539102941',
      digesaRegistryCode: 'RSA-DIGESA-2024-CUS-04891',
      qualityCertificates: [
        'Certificado HACCP N° HACCP-PE-2023-8910',
        'Buenas Prácticas de Manufactura BPM-DIGESA',
        'Certificación Orgánica USDA/EU'
      ],
      maxOctagonsAffidavit: true,
      originRegion: 'Cusco',
      producerPlan: 'PLAN_ORO',
      phone: '+51 984 999 111',
      address: 'Carretera Urubamba Km 14.5, Urubamba, Cusco / Despacho Lima: Av. Elmer Faucett 2100, Callao',
      createdAt: '2026-10-15T08:00:00Z',
    },
    {
      id: 'usr_a0481f7e_superadmin',
      email: 'superadmin@gmail.com',
      passwordHash: 'hash_123',
      role: 'SUPERADMIN',
      firstName: 'Dirección Operaciones',
      lastName: 'ALTOQ PE',
      companyName: 'ALTOQ PE Food Technology',
      companyRuc: '20711653786',
      dni: '42189056',
      phone: '+51 940 049 923',
      address: 'Lima Metropolitana, Perú',
      createdAt: '2026-10-01T00:00:00Z',
    },
  ],
  orders: [],
  quotes: [],
};

let memoryDb: DatabaseContent | null = null;

function readDb(): DatabaseContent {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryDb = {
        users: parsed.users && parsed.users.length > 0 ? parsed.users : DEFAULT_DB.users,
        orders: parsed.orders || [],
        quotes: parsed.quotes || [],
      };
      return memoryDb;
    }

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    } catch {
      // Entorno de solo lectura
    }

    memoryDb = JSON.parse(JSON.stringify(DEFAULT_DB));
    return memoryDb;
  } catch (error) {
    console.error('Error leyendo base de datos local:', error);
    memoryDb = JSON.parse(JSON.stringify(DEFAULT_DB));
    return memoryDb;
  }
}

function writeDb(data: DatabaseContent): void {
  memoryDb = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Persistencia en memoria activa:', error);
  }
}

export const StorageService = {
  getUsers: (): StoredUser[] => {
    return readDb().users;
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = readDb().users;
    const cleanEmail = email.toLowerCase().trim();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) return found;

    // Normalizar si se introduce con o sin @gmail.com o con @altoq.pe
    const username = cleanEmail.split('@')[0];
    const matchByUsername = users.find((u) => u.email.toLowerCase().startsWith(username + '@'));
    if (matchByUsername) return matchByUsername;

    // Aliases comunes
    if (cleanEmail === 'admin@gmail.com' || cleanEmail === 'admin@altoq.pe' || cleanEmail === 'admin') {
      return users.find((u) => u.email === 'superadmin@gmail.com');
    }
    if (cleanEmail === 'consumidor@gmail.com' || cleanEmail === 'consumidor@altoq.pe') {
      return users.find((u) => u.email === 'consumidormin@gmail.com');
    }
    return undefined;
  },

  findUserById: (id: string): StoredUser | undefined => {
    const users = readDb().users;
    return users.find((u) => u.id === id);
  },

  createUser: (userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser => {
    const db = readDb();
    const cleanEmail = userData.email.toLowerCase().trim();
    const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado en ALTOQ PE.');
    }

    // ID generado automáticamente de forma única
    const autoId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `usr_${crypto.randomUUID()}`
      : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newUser: StoredUser = {
      ...userData,
      email: cleanEmail,
      id: autoId,
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
