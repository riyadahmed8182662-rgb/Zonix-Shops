/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import {
  Product,
  Category,
  Order,
  OrderItem,
  ShippingAddress,
  StoreSettings,
  Banner,
  Coupon,
  InventoryEvent,
  AuditLog,
  SupportTicket,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'ZonixShop Bangladesh',
  supportEmail: 'support@zonixshop.com.bd',
  supportPhone: '+880 1700-123456',
  address: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  deliveryChargeInsideDhaka: 70,
  deliveryChargeOutsideDhaka: 130,
  freeShippingThreshold: 2500,
  codEnabled: true,
  bkashMerchantNumber: '01712345678',
  nagadMerchantNumber: '01912345678',
  bannerNotice: 'Grand Launch Offer! Use coupon ZONIX10 for 10% instant discount across Bangladesh.'
};

/* ==================== INITIAL VERIFIED DATA ==================== */

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    description: 'Smart watches, true wireless earbuds, chargers, and tech accessories',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    order: 1,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-fashion-men',
    name: "Men's Lifestyle",
    slug: 'mens-lifestyle',
    description: 'Premium Punjabi, casual shirts, genuine leather accessories',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    order: 2,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-fashion-women',
    name: "Women's Collection",
    slug: 'womens-collection',
    description: 'Designer sarees, kurti sets, scarves, and jewelry',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    order: 3,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-home-appliances',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Smart blenders, electric kettles, and modern kitchenware',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    order: 4,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-computing',
    name: 'Computer & Office',
    slug: 'computer-office',
    description: 'RGB mechanical keyboards, wireless mouse, and laptop stands',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    order: 5,
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'zx-pro-watch-ultra',
    name: 'Zonix Pro Ultra Smartwatch with AMOLED Display & Bluetooth Calling',
    slug: 'zonix-pro-ultra-smartwatch-amoled',
    description: 'The premier Bangladesh edition smartwatch featuring a crisp 1.43-inch Always-on AMOLED display, Bangla font support, IP68 water resistance, health metrics tracking, and 7-day battery life.',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics & Gadgets',
    price: 3450,
    originalPrice: 4800,
    stock: 35,
    sku: 'ZX-WTCH-001',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: true,
    rating: 4.8,
    reviewsCount: 42,
    attributes: {
      brand: 'ZonixTech',
      warranty: '1 Year Official Warranty',
      colors: ['Space Gray', 'Midnight Black', 'Starlight Silver']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-earbuds-anc-pro',
    name: 'Zonix SoundPods Pro ANC Active Noise Cancelling Earbuds',
    slug: 'zonix-soundpods-pro-anc-earbuds',
    description: 'Studio-grade sound with up to 35dB Active Noise Cancellation, transparent mode, ultra-low 45ms latency for gaming, dual ENC mics for crystal clear calls in Dhaka traffic.',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics & Gadgets',
    price: 2150,
    originalPrice: 3200,
    stock: 50,
    sku: 'ZX-AUDIO-002',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: true,
    rating: 4.9,
    reviewsCount: 68,
    attributes: {
      brand: 'Zonix Acoustics',
      warranty: '6 Months Replacement Guarantee',
      colors: ['Glossy White', 'Matte Black']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-panjabi-royal-cotton',
    name: 'Royal Heritage Embroidered Premium Cotton Panjabi (Festive Edition)',
    slug: 'royal-heritage-embroidered-cotton-panjabi',
    description: 'Handcrafted premium 100% combed cotton panjabi tailored for comfort and elegance. Detailed neckline embroidery with mother-of-pearl buttons. Perfect for Eid and weddings.',
    categoryId: 'cat-fashion-men',
    categoryName: "Men's Lifestyle",
    price: 2450,
    originalPrice: 3500,
    stock: 24,
    sku: 'ZX-FSH-003',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: true,
    rating: 4.7,
    reviewsCount: 29,
    attributes: {
      brand: 'Zonix Heritage',
      sizes: ['M (40)', 'L (42)', 'XL (44)', 'XXL (46)'],
      colors: ['Navy Blue', 'Maroon', 'White', 'Charcoal']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-jamdani-saree-dhakai',
    name: 'Traditional Dhakai Jamdani Handloom Saree (Geometric Floral Weave)',
    slug: 'traditional-dhakai-jamdani-handloom-saree',
    description: 'Exquisite authentic Dhakai Jamdani woven by traditional weavers in Narayanganj. Soft feel, breathable cotton-silk blend with intricate zari border work.',
    categoryId: 'cat-fashion-women',
    categoryName: "Women's Collection",
    price: 5200,
    originalPrice: 7500,
    stock: 12,
    sku: 'ZX-FSH-004',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: true,
    rating: 5.0,
    reviewsCount: 19,
    attributes: {
      brand: 'Bengal Looms',
      colors: ['Red & Gold', 'Black & Silver', 'Pastel Pink']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-powerbank-20000',
    name: 'Zonix PowerVault 20,000mAh 65W PD Fast Charging Power Bank',
    slug: 'zonix-powervault-20000mah-65w-fast-charger',
    description: 'Heavy duty portable power bank equipped with 65W Power Delivery capable of charging MacBooks, laptops, iPhones, and Android devices simultaneously with LED power display.',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics & Gadgets',
    price: 2890,
    originalPrice: 3800,
    stock: 40,
    sku: 'ZX-PWR-005',
    images: [
      'https://images.unsplash.com/photo-1609592426815-37ff4d46cf11?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: false,
    rating: 4.8,
    reviewsCount: 34,
    attributes: {
      brand: 'ZonixTech',
      warranty: '1 Year Brand Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-mech-keyboard-rgb',
    name: 'Zonix Strike-87 Mechanical Gaming Keyboard (Hot-Swappable Blue Switch)',
    slug: 'zonix-strike-87-mechanical-keyboard',
    description: 'Tenkeyless 87-key mechanical keyboard with dynamic per-key RGB backlighting, custom Banglish keycaps layout option, hot-swappable tactile switches, and detachable Type-C braided cable.',
    categoryId: 'cat-computing',
    categoryName: 'Computer & Office',
    price: 2950,
    originalPrice: 4200,
    stock: 18,
    sku: 'ZX-KB-006',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: false,
    rating: 4.9,
    reviewsCount: 22,
    attributes: {
      brand: 'Zonix Gaming',
      warranty: '1 Year Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-leather-wallet-rfid',
    name: 'Genuine Full-Grain Leather Bi-Fold Wallet with RFID Blocking Protection',
    slug: 'genuine-leather-bifold-wallet-rfid',
    description: 'Handmade in Hazaribagh, Dhaka from 100% genuine export-quality cowhide leather. Features 8 card slots, dedicated coin pouch, dual cash compartments, and RFID safe lining.',
    categoryId: 'cat-fashion-men',
    categoryName: "Men's Lifestyle",
    price: 980,
    originalPrice: 1500,
    stock: 65,
    sku: 'ZX-LTR-007',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: false,
    rating: 4.6,
    reviewsCount: 51,
    attributes: {
      brand: 'Heritage Leather BD',
      colors: ['Vintage Brown', 'Classic Black', 'Tan']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zx-electric-kettle-ss',
    name: 'Zonix SmartBoil 2.0L Double-Wall Stainless Steel Electric Kettle',
    slug: 'zonix-smartboil-electric-kettle-2l',
    description: 'Fast 1800W rapid boiling kettle with 304 food-grade stainless steel interior, cool-touch exterior, auto shut-off, and boil-dry protection. Essential for morning tea and coffee.',
    categoryId: 'cat-home-appliances',
    categoryName: 'Home & Kitchen',
    price: 1390,
    originalPrice: 1950,
    stock: 30,
    sku: 'ZX-KTL-008',
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddf4f240f08d?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'published',
    featured: false,
    rating: 4.7,
    reviewsCount: 15,
    attributes: {
      brand: 'Zonix Home',
      warranty: '1 Year Official Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ZONIX10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 500,
    validFrom: new Date(Date.now() - 86400000).toISOString(),
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
    usageLimit: 500,
    usedCount: 12,
    active: true
  },
  {
    code: 'EID500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 4000,
    maxDiscount: 500,
    validFrom: new Date(Date.now() - 86400000).toISOString(),
    validUntil: new Date(Date.now() + 60 * 86400000).toISOString(),
    usageLimit: 200,
    usedCount: 7,
    active: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 130,
    minOrderValue: 1500,
    validFrom: new Date(Date.now() - 86400000).toISOString(),
    validUntil: new Date(Date.now() + 90 * 86400000).toISOString(),
    usageLimit: 300,
    usedCount: 23,
    active: true
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-mega-sale',
    title: 'Festival Mega Sale 2026',
    subtitle: 'Up to 50% Discount on Smart Gadgets, Premium Panjabis & Jamdani Sarees',
    link: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 1,
    tag: 'FESTIVAL SPECIAL • UP TO 50% OFF',
    buttonText: 'Shop Mega Deals',
    badge: 'Limited Time Offer'
  },
  {
    id: 'banner-tech-watches',
    title: 'Zonix Next-Gen AMOLED Smartwatches',
    subtitle: 'Always-On AMOLED Display, Bangla Font Support & Bluetooth Calling with 7-Day Battery',
    link: '/category/cat-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 2,
    tag: 'PREMIUM GADGETS',
    buttonText: 'Explore Smartwatches',
    badge: 'Official Warranty'
  },
  {
    id: 'banner-dhakai-jamdani',
    title: 'Authentic Dhakai Jamdani & Silk Sarees',
    subtitle: 'Woven by master artisans in Narayanganj with intricate zari border and breathable fabric',
    link: '/category/cat-fashion-women',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 3,
    tag: 'WOMEN’S HERITAGE COLLECTION',
    buttonText: 'View Saree Collection',
    badge: '100% Traditional'
  },
  {
    id: 'banner-men-panjabi',
    title: 'Exclusive Men’s Festive Panjabi Collection',
    subtitle: 'Pure cotton, linen & silk fabrics tailored for ultimate comfort and festive celebrations',
    link: '/category/cat-fashion-men',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 4,
    tag: 'NEW ARRIVALS',
    buttonText: 'Shop Panjabis',
    badge: 'Premium Stitching'
  },
  {
    id: 'banner-audio-earbuds',
    title: 'Studio-Grade Active Noise Cancelling Audio',
    subtitle: 'Block out city traffic with 35dB ANC, crystal-clear ENC call mics, and ultra-low gaming latency',
    link: '/category/cat-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 5,
    tag: 'ZONIX AUDIO PRO',
    buttonText: 'Discover SoundPods',
    badge: 'Best Seller'
  },
  {
    id: 'banner-home-appliances',
    title: 'Modern Kitchen & Smart Living Essentials',
    subtitle: 'Double-wall rapid electric kettles, smart appliances, and daily lifestyle essentials',
    link: '/category/cat-home-appliances',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 6,
    tag: 'HOME ESSENTIALS',
    buttonText: 'Shop Kitchenware',
    badge: 'Cash on Delivery'
  }
];

/* ==================== PRODUCTS ==================== */

export async function fetchProducts(includeUnpublished = false): Promise<Product[]> {
  const collectionPath = 'products';
  try {
    let q;
    if (includeUnpublished) {
      q = query(collection(db, collectionPath));
    } else {
      q = query(collection(db, collectionPath), where('status', '==', 'published'));
    }
    const snap = await getDocs(q);
    const products: Product[] = [];
    snap.forEach((d) => {
      products.push(d.data() as Product);
    });

    if (products.length === 0) {
      return INITIAL_PRODUCTS;
    }
    return products;
  } catch (err) {
    console.warn('Firestore fetchProducts fallback to initial:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const docPath = `products/${productId}`;
  try {
    const snap = await getDoc(doc(db, 'products', productId));
    if (!snap.exists()) {
      const fallback = INITIAL_PRODUCTS.find((p) => p.id === productId);
      return fallback || null;
    }
    return snap.data() as Product;
  } catch (err) {
    const fallback = INITIAL_PRODUCTS.find((p) => p.id === productId);
    return fallback || null;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const docPath = `products/${product.id}`;
  try {
    const now = new Date().toISOString();
    const payload = {
      ...product,
      updatedAt: now,
      createdAt: product.createdAt || now
    };
    await setDoc(doc(db, 'products', product.id), payload, { merge: true });

    await recordAuditLog({
      action: product.createdAt ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT',
      resource: 'products',
      resourceId: product.id,
      details: { name: product.name, price: product.price, stock: product.stock }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const docPath = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
    await recordAuditLog({
      action: 'DELETE_PRODUCT',
      resource: 'products',
      resourceId: productId
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

/* ==================== CATEGORIES ==================== */

export async function fetchCategories(): Promise<Category[]> {
  const collectionPath = 'categories';
  try {
    const q = query(collection(db, collectionPath), where('active', '==', true));
    const snap = await getDocs(q);
    const list: Category[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Category);
    });
    if (list.length === 0) return INITIAL_CATEGORIES;
    return list.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.warn('Firestore fetchCategories fallback to initial:', err);
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const docPath = `categories/${category.id}`;
  try {
    await setDoc(doc(db, 'categories', category.id), category, { merge: true });
    await recordAuditLog({
      action: 'SAVE_CATEGORY',
      resource: 'categories',
      resourceId: category.id,
      details: { name: category.name }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

/* ==================== STORE SETTINGS ==================== */

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const docPath = 'storeSettings/general';
  try {
    const snap = await getDoc(doc(db, 'storeSettings', 'general'));
    if (!snap.exists()) {
      return DEFAULT_STORE_SETTINGS;
    }
    return { ...DEFAULT_STORE_SETTINGS, ...snap.data() } as StoreSettings;
  } catch (err) {
    console.warn('Using default store settings:', err);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const docPath = 'storeSettings/general';
  try {
    await setDoc(doc(db, 'storeSettings', 'general'), settings, { merge: true });
    await recordAuditLog({
      action: 'UPDATE_SETTINGS',
      resource: 'storeSettings',
      resourceId: 'general',
      details: { storeName: settings.storeName }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

/* ==================== BANNERS ==================== */

export async function fetchBanners(): Promise<Banner[]> {
  const collectionPath = 'banners';
  try {
    const snap = await getDocs(query(collection(db, collectionPath), where('active', '==', true)));
    const list: Banner[] = [];
    snap.forEach((d) => list.push(d.data() as Banner));
    if (list.length === 0) return INITIAL_BANNERS;
    return list.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.warn('Banners fetch fallback to initial:', err);
    return INITIAL_BANNERS;
  }
}

export async function saveBanner(banner: Banner): Promise<void> {
  const docPath = `banners/${banner.id}`;
  try {
    await setDoc(doc(db, 'banners', banner.id), banner, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteBanner(id: string): Promise<void> {
  const docPath = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

/* ==================== COUPONS ==================== */

export async function fetchActiveCoupons(): Promise<Coupon[]> {
  const collectionPath = 'coupons';
  try {
    const q = query(collection(db, collectionPath), where('active', '==', true));
    const snap = await getDocs(q);
    const list: Coupon[] = [];
    snap.forEach((d) => list.push(d.data() as Coupon));
    if (list.length === 0) return INITIAL_COUPONS;
    return list;
  } catch (err) {
    console.warn('Could not fetch active coupons from Firestore, using initial:', err);
    return INITIAL_COUPONS;
  }
}

export async function fetchAllCoupons(): Promise<Coupon[]> {
  const collectionPath = 'coupons';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: Coupon[] = [];
    snap.forEach((d) => list.push(d.data() as Coupon));
    if (list.length === 0) return INITIAL_COUPONS;
    return list;
  } catch (err) {
    console.warn('fetchAllCoupons fallback to initial:', err);
    return INITIAL_COUPONS;
  }
}

export async function validateCouponCode(code: string, currentSubtotal: number): Promise<{ coupon: Coupon; discountAmount: number }> {
  const cleanCode = code.trim().toUpperCase();
  const docPath = `coupons/${cleanCode}`;

  let coupon: Coupon | undefined;
  try {
    const snap = await getDoc(doc(db, 'coupons', cleanCode));
    if (snap.exists()) {
      coupon = snap.data() as Coupon;
    }
  } catch {
    // Fall back to initial list if unauthenticated or network issue
  }

  if (!coupon) {
    coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode);
  }

  if (!coupon) {
    throw new Error(`Coupon code '${cleanCode}' is invalid.`);
  }

  if (!coupon.active) {
    throw new Error(`Coupon '${cleanCode}' is currently inactive.`);
  }
  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    throw new Error(`Coupon '${cleanCode}' is not active yet.`);
  }
  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    throw new Error(`Coupon '${cleanCode}' has expired.`);
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new Error(`Coupon '${cleanCode}' usage limit has been reached.`);
  }
  if (coupon.minOrderValue > 0 && currentSubtotal < coupon.minOrderValue) {
    throw new Error(`Minimum order value of ৳${coupon.minOrderValue} required for this coupon.`);
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (currentSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }
  discountAmount = Math.min(discountAmount, currentSubtotal);

  return { coupon, discountAmount: Math.round(discountAmount) };
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const docPath = `coupons/${coupon.code.toUpperCase()}`;
  try {
    await setDoc(doc(db, 'coupons', coupon.code.toUpperCase()), {
      ...coupon,
      code: coupon.code.toUpperCase()
    }, { merge: true });
    await recordAuditLog({
      action: 'SAVE_COUPON',
      resource: 'coupons',
      resourceId: coupon.code,
      details: { discountValue: coupon.discountValue, discountType: coupon.discountType }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

/* ==================== SECURE ATOMIC ORDER CREATION ==================== */

export interface CreateOrderParams {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  clientItems: Array<{ productId: string; quantity: number; selectedVariant?: string }>;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  paymentTransactionId?: string;
  paymentSenderNumber?: string;
  notes?: string;
}

export async function createOrderSecurely(params: CreateOrderParams): Promise<Order> {
  const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const orderNumber = 'ZX-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  return await runTransaction(db, async (transaction) => {
    const verifiedOrderItems: OrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of params.clientItems) {
      const prodRef = doc(db, 'products', item.productId);
      const prodDoc = await transaction.get(prodRef);

      let prodData: Product;

      if (!prodDoc.exists()) {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
        if (!fallback) {
          throw new Error(`Product ID ${item.productId} was not found in catalog.`);
        }
        prodData = fallback;
      } else {
        prodData = prodDoc.data() as Product;
      }

      if (prodData.status !== 'published') {
        throw new Error(`Product '${prodData.name}' is no longer available.`);
      }

      if (prodData.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for '${prodData.name}'. Requested: ${item.quantity}, Available: ${prodData.stock}`
        );
      }

      // Decrement stock if doc exists
      if (prodDoc.exists()) {
        const newStock = prodData.stock - item.quantity;
        transaction.update(prodRef, {
          stock: newStock,
          updatedAt: now
        });
      }

      const lineTotal = prodData.price * item.quantity;
      calculatedSubtotal += lineTotal;

      verifiedOrderItems.push({
        productId: prodData.id,
        productName: prodData.name,
        sku: prodData.sku,
        price: prodData.price,
        quantity: item.quantity,
        image: prodData.images?.[0] || '',
        variant: item.selectedVariant
      });

      // Record inventory event
      const invEventRef = doc(db, 'inventoryEvents', `inv_${orderId}_${prodData.id}`);
      const invEvent: InventoryEvent = {
        id: `inv_${orderId}_${prodData.id}`,
        productId: prodData.id,
        changeType: 'order_placed',
        delta: -item.quantity,
        remainingStock: Math.max(0, prodData.stock - item.quantity),
        orderId,
        notes: `Order placed ${orderNumber}`,
        timestamp: now
      };
      transaction.set(invEventRef, invEvent);
    }

    // Settings
    const settingsSnap = await transaction.get(doc(db, 'storeSettings', 'general'));
    const settings: StoreSettings = settingsSnap.exists()
      ? ({ ...DEFAULT_STORE_SETTINGS, ...settingsSnap.data() } as StoreSettings)
      : DEFAULT_STORE_SETTINGS;

    let shippingFee = params.shippingAddress.isInsideDhaka
      ? settings.deliveryChargeInsideDhaka
      : settings.deliveryChargeOutsideDhaka;

    if (settings.freeShippingThreshold > 0 && calculatedSubtotal >= settings.freeShippingThreshold) {
      shippingFee = 0;
    }

    // Coupon
    let calculatedDiscount = 0;
    let validCouponCode = '';

    if (params.couponCode?.trim()) {
      const codeUpper = params.couponCode.trim().toUpperCase();
      const couponRef = doc(db, 'coupons', codeUpper);
      const couponDoc = await transaction.get(couponRef);

      let cData: Coupon | undefined;
      if (couponDoc.exists()) {
        cData = couponDoc.data() as Coupon;
      } else {
        cData = INITIAL_COUPONS.find((c) => c.code === codeUpper);
      }

      if (cData && cData.active && calculatedSubtotal >= (cData.minOrderValue || 0)) {
        if (cData.discountType === 'percentage') {
          let disc = (calculatedSubtotal * cData.discountValue) / 100;
          if (cData.maxDiscount && cData.maxDiscount > 0) {
            disc = Math.min(disc, cData.maxDiscount);
          }
          calculatedDiscount = Math.round(disc);
        } else {
          calculatedDiscount = Math.round(cData.discountValue);
        }
        calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
        validCouponCode = codeUpper;

        if (couponDoc.exists()) {
          transaction.update(couponRef, {
            usedCount: (cData.usedCount || 0) + 1
          });
        }
      }
    }

    const calculatedTotal = calculatedSubtotal - calculatedDiscount + shippingFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      shippingAddress: params.shippingAddress,
      items: verifiedOrderItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shippingFee,
      total: calculatedTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: (params.paymentMethod === 'bkash' || params.paymentMethod === 'nagad') && params.paymentTransactionId
        ? 'pending_verification'
        : 'unpaid',
      orderStatus: 'pending',
      paymentTransactionId: params.paymentTransactionId || '',
      paymentSenderNumber: params.paymentSenderNumber || '',
      notes: params.notes || '',
      couponCode: validCouponCode,
      createdAt: now,
      updatedAt: now
    };

    const orderRef = doc(db, 'orders', orderId);
    transaction.set(orderRef, newOrder);

    // Audit Log
    const auditRef = doc(db, 'auditLogs', `audit_${orderId}`);
    const auditLog: AuditLog = {
      id: `audit_${orderId}`,
      actorId: params.customerId,
      actorEmail: params.customerEmail,
      action: 'ORDER_PLACED',
      resource: 'orders',
      resourceId: orderId,
      details: { orderNumber, total: calculatedTotal, paymentMethod: params.paymentMethod },
      timestamp: now
    };
    transaction.set(auditRef, auditLog);

    return newOrder;
  });
}

/* ==================== ORDERS QUERY & MANAGEMENT ==================== */

export async function fetchCustomerOrders(customerId: string): Promise<Order[]> {
  const collectionPath = 'orders';
  try {
    const q = query(
      collection(db, collectionPath),
      where('customerId', '==', customerId)
    );
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => list.push(d.data() as Order));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('fetchCustomerOrders error:', err);
    return [];
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  const collectionPath = 'orders';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: Order[] = [];
    snap.forEach((d) => list.push(d.data() as Order));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('fetchAllOrders error:', err);
    return [];
  }
}

export async function fetchOrderByIdOrNumber(identifier: string): Promise<Order | null> {
  const clean = identifier.trim();
  try {
    const directSnap = await getDoc(doc(db, 'orders', clean));
    if (directSnap.exists()) return directSnap.data() as Order;

    const q = query(collection(db, 'orders'), where('orderNumber', '==', clean));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      return qSnap.docs[0].data() as Order;
    }
    return null;
  } catch (err) {
    console.warn('fetchOrderByIdOrNumber error:', err);
    return null;
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  courierName?: string,
  trackingNumber?: string
): Promise<void> {
  const docPath = `orders/${orderId}`;
  try {
    const payload: Partial<Order> = {
      orderStatus: newStatus,
      updatedAt: new Date().toISOString()
    };
    if (courierName) payload.courierName = courierName;
    if (trackingNumber) payload.trackingNumber = trackingNumber;

    await updateDoc(doc(db, 'orders', orderId), payload);

    await recordAuditLog({
      action: 'UPDATE_ORDER_STATUS',
      resource: 'orders',
      resourceId: orderId,
      details: { newStatus, courierName, trackingNumber }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<void> {
  const docPath = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus,
      updatedAt: new Date().toISOString()
    });

    await recordAuditLog({
      action: 'UPDATE_PAYMENT_STATUS',
      resource: 'orders',
      resourceId: orderId,
      details: { paymentStatus }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}

/* ==================== AUDIT LOGS & INVENTORY LOGS ==================== */

export async function recordAuditLog(log: Omit<AuditLog, 'id' | 'actorId' | 'actorEmail' | 'timestamp'>): Promise<void> {
  try {
    const user = auth.currentUser;
    const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newLog: AuditLog = {
      id: logId,
      actorId: user?.uid || 'system',
      actorEmail: user?.email || 'system@zonixshop.com.bd',
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: log.details || {},
      timestamp: new Date().toISOString()
    };
    await setDoc(doc(db, 'auditLogs', logId), newLog);
  } catch (e) {
    console.warn('Audit log write note:', e);
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const collectionPath = 'auditLogs';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: AuditLog[] = [];
    snap.forEach((d) => list.push(d.data() as AuditLog));
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.warn('fetchAuditLogs error:', err);
    return [];
  }
}

export async function fetchInventoryEvents(): Promise<InventoryEvent[]> {
  const collectionPath = 'inventoryEvents';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: InventoryEvent[] = [];
    snap.forEach((d) => list.push(d.data() as InventoryEvent));
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.warn('fetchInventoryEvents error:', err);
    return [];
  }
}

/* ==================== SUPPORT TICKETS ==================== */

export async function fetchCustomerTickets(customerId: string): Promise<SupportTicket[]> {
  const collectionPath = 'supportTickets';
  try {
    const q = query(collection(db, collectionPath), where('customerId', '==', customerId));
    const snap = await getDocs(q);
    const list: SupportTicket[] = [];
    snap.forEach((d) => list.push(d.data() as SupportTicket));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('fetchCustomerTickets error:', err);
    return [];
  }
}

export async function fetchAllSupportTickets(): Promise<SupportTicket[]> {
  const collectionPath = 'supportTickets';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: SupportTicket[] = [];
    snap.forEach((d) => list.push(d.data() as SupportTicket));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('fetchAllSupportTickets error:', err);
    return [];
  }
}

export async function createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<SupportTicket> {
  const ticketId = 'tkt_' + Date.now();
  const now = new Date().toISOString();
  const newTicket: SupportTicket = {
    ...ticket,
    id: ticketId,
    replies: [],
    createdAt: now,
    updatedAt: now
  };
  try {
    await setDoc(doc(db, 'supportTickets', ticketId), newTicket);
    return newTicket;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `supportTickets/${ticketId}`);
  }
}

export async function replySupportTicket(
  ticketId: string,
  reply: { senderId: string; senderName: string; senderRole: 'customer' | 'admin'; message: string },
  newStatus?: SupportTicket['status']
): Promise<void> {
  const docPath = `supportTickets/${ticketId}`;
  try {
    const snap = await getDoc(doc(db, 'supportTickets', ticketId));
    if (!snap.exists()) throw new Error('Ticket not found');
    const ticket = snap.data() as SupportTicket;
    const now = new Date().toISOString();
    const updatedReplies = [
      ...(ticket.replies || []),
      { ...reply, timestamp: now }
    ];
    await updateDoc(doc(db, 'supportTickets', ticketId), {
      replies: updatedReplies,
      status: newStatus || ticket.status,
      updatedAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}

/* ==================== DATABASE SEEDING ==================== */

export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  try {
    // Only attempt Firestore writes if an authorized user/admin is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return false;
    }

    const prodSnap = await getDocs(collection(db, 'products'));
    if (!prodSnap.empty) {
      return false;
    }

    console.log('Seeding initial ZonixShop Bangladesh catalog into Firestore...');

    for (const c of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', c.id), c);
    }

    for (const p of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', p.id), p);
    }

    await setDoc(doc(db, 'storeSettings', 'general'), DEFAULT_STORE_SETTINGS);

    for (const cp of INITIAL_COUPONS) {
      await setDoc(doc(db, 'coupons', cp.code), cp);
    }

    for (const b of INITIAL_BANNERS) {
      await setDoc(doc(db, 'banners', b.id), b);
    }

    console.log('ZonixShop catalog and configuration successfully seeded into Firestore.');
    return true;
  } catch (error) {
    console.warn('Seeding note (requires admin privileges):', error);
    return false;
  }
}
