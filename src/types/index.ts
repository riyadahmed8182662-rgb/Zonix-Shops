/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
  images: string[];
  status: 'published' | 'draft' | 'archived';
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  attributes?: {
    sizes?: string[];
    colors?: string[];
    warranty?: string;
    brand?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  active: boolean;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  division: string;
  district: string;
  cityArea: string;
  fullAddress: string;
  deliveryNotes?: string;
  isInsideDhaka: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentTransactionId?: string;
  paymentSenderNumber?: string;
  notes?: string;
  couponCode?: string;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  defaultShipping?: Partial<ShippingAddress>;
  role: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  bannerNotice: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  imageUrl: string;
  active: boolean;
  order: number;
  tag?: string;
  buttonText?: string;
  badge?: string;
}

export interface InventoryEvent {
  id: string;
  productId: string;
  changeType: 'order_placed' | 'admin_restock' | 'admin_adjustment' | 'order_cancelled';
  delta: number;
  remainingStock: number;
  orderId?: string;
  notes?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  replies: Array<{
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'admin';
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
