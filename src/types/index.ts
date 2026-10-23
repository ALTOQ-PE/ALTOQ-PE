// ==============================================================================
// ALTOQ PE - DEFINICIÓN DE TIPOS GLOBALES DE TYPESCRIPT
// Tipado seguro para Roles, Suscripciones, Modelos de Compra y Unit Economics
// REGLA ESTRICTA: Sin uso de emojis en código ni comentarios
// ==============================================================================

export type Role =
  | 'CONSUMER_RETAIL'
  | 'CONSUMER_WHOLESALE'
  | 'PRODUCER'
  | 'ADMIN'
  | 'SUPERADMIN';

export type ConsumerSubscriptionPlan = 'PLAN_GRATUITO' | 'PLAN_ORO';

export type ProducerSubscriptionPlan = 'PLAN_PLATA' | 'PLAN_ORO';

export type ProductCategory =
  | 'PLATO_TIPICO_LIOFILIZADO'
  | 'SOPA_INSTANTANEA'
  | 'SNACK_LIOFILIZADO'
  | 'PACK_PRUEBA'
  | 'EXTRACTO_SUPERFOOD';

export type SupplyModality = 'CONSIGNACION_LIMA' | 'BAJO_DEMANDA';

export type OrderStatus =
  | 'PAGO_PENDIENTE'
  | 'PAGO_VALIDADO'
  | 'ALISTADO_EN_SECO'
  | 'EN_RUTA_COURIER'
  | 'ENTREGADO'
  | 'CANCELADO';

export type PaymentMethod =
  | 'YAPE_PLIN'
  | 'TARJETA_CULQI'
  | 'ALTOQ_CREDITS'
  | 'TRANSFERENCIA_BCP';

export type BillingDocType = 'DNI' | 'RUC';

export type SettlementFrequency = 'QUINCENAL' | 'MENSUAL';

export type SettlementStatus = 'PENDIENTE' | 'APROBADA' | 'PAGADA';

export type CreditTxType =
  | 'REFUND_WARRANTY'
  | 'PURCHASE_REDEMPTION'
  | 'BONUS_PROMO'
  | 'ADMIN_ADJUSTMENT';

// Desglose de Unit Economics por Pedido
export interface UnitEconomicsBreakdown {
  publicPricePen: number;        // P (Precio publico con IGV)
  freightChargedPen: number;     // F_cobrado
  wholesaleCostPen: number;      // C_prod (Costo productor ex-planta)
  packagingCostPen: number;      // C_emp (Costo empaque rigido antihumedad)
  shippingCostRealPen: number;   // C_env (Flete courier real)
  gatewayCostPen: number;        // C_pas (Comision pasarela Culqi o Yape)
  creditProvisionPen: number;    // Provision para garantia Altoq Creditos
  contributionMarginPen: number; // MCu = (P + F) - (C_prod + C_emp + C_env + C_pas + Prov)
}

// Interfaz de Producto para Catálogo de Compra Informada
export interface CatalogProduct {
  id: string;
  producerId: string;
  producerName: string;
  originRegion: string;
  commercialName: string;
  slug: string;
  category: ProductCategory;
  isTrialPack: boolean;
  culturalContext: string;
  ingredients: string;
  netWeightGrams: number;
  rehydratedYieldGrams: number;
  allergens: string[];
  prepSteps: string;
  packagingPhotoUrl: string;
  dishPhotoUrl: string;
  youtubeRecipeUrl?: string;
  packagingBarrierType: string;
  stockInLima: number;
  wholesaleCostPen: number;
  publicPricePen: number;
  wholesalePricePen?: number;
  wholesaleMoqUnits: number;
  techSheetUrl?: string;
  isExclusiveGold: boolean;
  commissionPercentage: number;
  digesaCode: string;
  qualityCertificatesUrls: string[];
  octagonCount: number; // Restriccion estricta: 0 <= octagonCount <= 2
  octagonTypes: string[];
  healthPolicyAccepted: boolean;
  galleryPhotos?: string[];
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  userName: string;
  userRole?: string;
  rating: number; // 1 a 5
  date: string;
  verifiedPurchase: boolean;
  title: string;
  comment: string;
}

// Interfaz para Perfil de Consumidor Minorista
export interface RetailConsumerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneWhatsapp: string;
  addressLine: string;
  district: string;
  preferredPaymentMethod: PaymentMethod;
  subscriptionPlan: ConsumerSubscriptionPlan;
  filipuntosBalance: number;
  altoqCreditsBalance: number;
}

// Interfaz para Perfil de Consumidor Mayorista (B2B)
export interface WholesaleConsumerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneWhatsapp: string;
  addressLine: string;
  preferredPaymentMethod: PaymentMethod;
  companyName: string;
  companyRuc: string;
  subscriptionPlan: ConsumerSubscriptionPlan;
  isWholesaleVerified: boolean;
  pendingQuotesCount: number;
  assignedAdvisorName?: string;
}

// Interfaz para Perfil de Productor Agroindustrial
export interface ProducerDashboardProfile {
  id: string;
  email: string;
  companyName: string;
  ruc: string;
  digesaRegistryCode: string;
  qualityCertificates: string[];
  maxOctagonsAffidavit: boolean;
  originRegion: string;
  subscriptionPlan: ProducerSubscriptionPlan;
  productsPublishedCount: number;
  maxProductsAllowed: number; // 3 para Plata, ilimitado para Oro
  stockInLimaUnits: number;
  pendingSettlementPen: number;
  trialEndsAt?: string;
  digitalLiteracyCompleted: boolean;
}

// Interfaz para Cotizaciones Mayoristas B2B
export interface WholesaleQuote {
  id: string;
  quoteNumber: string;
  userId: string;
  companyName: string;
  companyRuc: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    boxCount: number;
    unitsPerBox: number;
    pricePerBoxPen: number;
    totalItemPen: number;
  }>;
  subtotalPen: number;
  igvPen: number;
  totalPen: number;
  validUntil: string;
  status: 'PENDIENTE_REVISION' | 'COTIZACION_EMITIDA' | 'ACEPTADA' | 'RECHAZADA';
  createdAt: string;
}
