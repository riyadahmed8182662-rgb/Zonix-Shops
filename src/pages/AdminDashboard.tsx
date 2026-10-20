/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle,
  Truck,
  Tag,
  Image as ImageIcon,
  Headphones,
  Settings,
  Shield,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Send,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Product,
  Category,
  Order,
  OrderStatus,
  PaymentStatus,
  Coupon,
  StoreSettings,
  Banner,
  AuditLog,
  InventoryEvent,
  SupportTicket
} from '../types';
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  fetchCategories,
  fetchAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  fetchStoreSettings,
  saveStoreSettings,
  fetchAllCoupons,
  saveCoupon,
  fetchBanners,
  saveBanner,
  deleteBanner,
  fetchAuditLogs,
  fetchInventoryEvents,
  fetchAllSupportTickets,
  replySupportTicket
} from '../services/storeService';

interface AdminDashboardProps {
  onBackToShop: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToShop }) => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'banners' | 'tickets' | 'audit' | 'settings'
  >('overview');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryEvent[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Modals & Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodCategory, setProdCategory] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStatus, setProdStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [prodBrand, setProdBrand] = useState('');
  const [prodWarranty, setProdWarranty] = useState('');

  // Order Update Form
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Restock Modal
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState(10);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        prods,
        cats,
        ords,
        cps,
        bns,
        logs,
        invs,
        tkts,
        stngs
      ] = await Promise.all([
        fetchProducts(true),
        fetchCategories(),
        fetchAllOrders(),
        fetchAllCoupons(),
        fetchBanners(),
        fetchAuditLogs(),
        fetchInventoryEvents(),
        fetchAllSupportTickets(),
        fetchStoreSettings()
      ]);

      setProducts(prods || []);
      setCategories(cats || []);
      setOrders(ords || []);
      setCoupons(cps || []);
      setBanners(bns || []);
      setAuditLogs(logs || []);
      setInventoryLogs(invs || []);
      setTickets(tkts || []);
      setSettings(stngs || null);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Restricted Access</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          This operations portal is restricted to authorized ZonixShop administrators. Your current account does not have verified administrative permissions in Firestore.
        </p>
        <button
          onClick={onBackToShop}
          className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // Handle Product Save
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdPrice(product.price);
      setProdOriginalPrice(product.originalPrice);
      setProdStock(product.stock);
      setProdCategory(product.categoryId);
      setProdSku(product.sku);
      setProdImageUrl(product.images?.[0] || '');
      setProdDescription(product.description);
      setProdStatus(product.status);
      setProdBrand(product.attributes?.brand || '');
      setProdWarranty(product.attributes?.warranty || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdPrice(1000);
      setProdOriginalPrice(1500);
      setProdStock(25);
      setProdCategory(categories[0]?.id || 'cat-electronics');
      setProdSku('ZX-NEW-' + Math.floor(100 + Math.random() * 900));
      setProdImageUrl('');
      setProdDescription('');
      setProdStatus('published');
      setProdBrand('');
      setProdWarranty('1 Year Official Warranty');
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : 'zx-' + Date.now();
    const selectedCat = categories.find((c) => c.id === prodCategory);

    const newProd: Product = {
      id,
      name: prodName.trim(),
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: prodDescription.trim(),
      categoryId: prodCategory,
      categoryName: selectedCat?.name || 'General',
      price: Number(prodPrice),
      originalPrice: Number(prodOriginalPrice || prodPrice),
      stock: Number(prodStock),
      sku: prodSku.trim(),
      images: [prodImageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
      status: prodStatus,
      attributes: {
        brand: prodBrand.trim() || undefined,
        warranty: prodWarranty.trim() || undefined
      },
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    try {
      await saveProduct(newProd);
      setShowProductModal(false);
      setStatusMsg(`Product "${newProd.name}" saved successfully.`);
      setTimeout(() => setStatusMsg(null), 3000);
      await loadAllData();
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(productId);
      setStatusMsg(`Product "${name}" deleted.`);
      setTimeout(() => setStatusMsg(null), 3000);
      await loadAllData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Restock Action
  const handleRestockSubmit = async () => {
    if (!restockProduct) return;
    const newStock = restockProduct.stock + Number(restockAmount);
    try {
      await saveProduct({ ...restockProduct, stock: newStock });
      setRestockProduct(null);
      setStatusMsg(`Restocked ${restockProduct.name}. New stock: ${newStock}`);
      setTimeout(() => setStatusMsg(null), 3000);
      await loadAllData();
    } catch (err: any) {
      alert('Restock failed: ' + err.message);
    }
  };

  // Order Status Update
  const handleSelectOrderForEdit = (order: Order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setCourierName(order.courierName || 'Steadfast Courier');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, newOrderStatus, courierName, trackingNumber);
      if (newPaymentStatus !== selectedOrder.paymentStatus) {
        await updatePaymentStatus(selectedOrder.id, newPaymentStatus);
      }
      setSelectedOrder(null);
      setStatusMsg(`Order ${selectedOrder.orderNumber} updated successfully.`);
      setTimeout(() => setStatusMsg(null), 3000);
      await loadAllData();
    } catch (err: any) {
      alert('Order update error: ' + err.message);
    }
  };

  // Admin Reply Ticket
  const handleAdminReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReplyText.trim() || !user) return;
    try {
      await replySupportTicket(
        selectedTicket.id,
        {
          senderId: user.uid,
          senderName: 'ZonixShop Management',
          senderRole: 'admin',
          message: adminReplyText.trim()
        },
        'in_progress'
      );
      setAdminReplyText('');
      setStatusMsg('Reply sent to customer.');
      setTimeout(() => setStatusMsg(null), 3000);
      await loadAllData();
      setSelectedTicket(null);
    } catch (err: any) {
      alert('Reply error: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/file_00000000903c82119a2402c1123cd3f9_094b811e.png"
              alt="ZonixShop"
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Admin Operations Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
              Production Verified
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Logged in as <strong className="text-gray-800">{user?.email}</strong> • Direct Firestore Read/Write Access
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={onBackToShop}
            className="px-4 py-2 bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Back to Storefront
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto space-x-6 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'products' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'inventory' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Inventory Hub {lowStockProducts.length > 0 && `(${lowStockProducts.length} low)`}</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'coupons' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'tickets' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Support Helpdesk ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'audit' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'settings' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <span className="text-gray-500 text-xs font-semibold">Total Revenue</span>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">৳{totalRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Live Firestore records</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <span className="text-gray-500 text-xs font-semibold">Total Orders</span>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrders}</div>
              <span className="text-[11px] text-gray-500 mt-1 block">{pendingOrders} Pending Fulfillment</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <span className="text-gray-500 text-xs font-semibold">Active Products</span>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">
                {products.filter((p) => p.status === 'published').length}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">{products.length} Total in Database</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <span className="text-gray-500 text-xs font-semibold">Low Stock Items</span>
              <div className="text-2xl font-extrabold text-orange-600 mt-1">{lowStockProducts.length}</div>
              <span className="text-[11px] text-orange-700 font-semibold mt-1 block">
                {lowStockProducts.length > 0 ? 'Requires restock soon' : 'All stocks healthy'}
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View All Orders
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{o.orderNumber}</span>
                    <p className="text-gray-500 text-[11px]">{o.customerName} • {o.shippingAddress.district}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">৳{o.total.toLocaleString()}</span>
                    <span className="block text-[10px] uppercase font-bold text-emerald-700">{o.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Catalog Product Management</h2>
              <p className="text-xs text-gray-500">Add, edit, publish/unpublish, and manage pricing & inventory.</p>
            </div>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU / Cat</th>
                    <th className="p-4">Price (৳)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.attributes?.brand || 'Zonix'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-[11px] text-gray-800">{p.sku}</span>
                        <p className="text-[11px] text-gray-400">{p.categoryName}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">৳{p.price.toLocaleString()}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through block">৳{p.originalPrice}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            p.stock <= 0
                              ? 'bg-red-100 text-red-700'
                              : p.stock < 10
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenProductModal(p)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setRestockProduct(p);
                            setRestockAmount(20);
                          }}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg"
                          title="Quick Restock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Order Management & Courier Booking</h2>
            <p className="text-xs text-gray-500">Update status, verify bKash/Nagad transactions, and link courier tracking.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order / Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total (৳)</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Fulfillment Status</th>
                    <th className="p-4">Courier</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 block">{o.orderNumber}</span>
                        <span className="text-gray-800 font-medium">{o.customerName}</span>
                        <p className="text-[11px] text-gray-400">{o.customerPhone}</p>
                        <p className="text-[10px] text-gray-400">{o.shippingAddress.division}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800">{o.items.length} items</span>
                        <p className="text-[11px] text-gray-400 truncate max-w-[150px]">
                          {o.items.map((i) => i.productName).join(', ')}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        ৳{o.total.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[11px] uppercase block">{o.paymentMethod}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            o.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.paymentStatus === 'pending_verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                        {o.paymentTransactionId && (
                          <span className="block text-[10px] font-mono text-gray-500 mt-0.5">
                            Trx: {o.paymentTransactionId}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            o.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : o.orderStatus === 'confirmed'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {o.courierName ? (
                          <div>
                            <span className="font-semibold text-gray-800 block text-[11px]">{o.courierName}</span>
                            <span className="font-mono text-[10px] text-gray-500">{o.trackingNumber}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleSelectOrderForEdit(o)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY HUB */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Inventory Stock & Alerts Hub</h2>
              <p className="text-xs text-gray-500">Atomic inventory levels synced across active orders.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex justify-between items-center gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl bg-gray-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">SKU: {p.sku}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-gray-800">৳{p.price.toLocaleString()}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.stock <= 0
                            ? 'bg-red-100 text-red-700'
                            : p.stock < 10
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRestockProduct(p);
                    setRestockAmount(20);
                  }}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>

          {/* Recent Inventory Changes */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Inventory Log Events</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {inventoryLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-900">{log.notes || log.changeType}</span>
                    <span className="text-[11px] text-gray-400 ml-2 font-mono">
                      Remaining: {log.remainingStock}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold ${
                        log.delta > 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {log.delta > 0 ? `+${log.delta}` : log.delta}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Promotions & Coupons</h2>
              <p className="text-xs text-gray-500">Configure discount codes, eligibility criteria, and maximum caps.</p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon(null);
                setShowCouponModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono font-extrabold text-sm rounded-lg border border-emerald-200">
                    {c.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    Discount: <strong>{c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}</strong>
                  </p>
                  <p>Min Order Value: <strong>৳{c.minOrderValue}</strong></p>
                  {c.maxDiscount ? <p>Max Cap: <strong>৳{c.maxDiscount}</strong></p> : null}
                  <p className="text-[11px] text-gray-400">Used: {c.usedCount} times / Limit: {c.usageLimit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Customer Care & Support Helpdesk</h2>
            <p className="text-xs text-gray-500">Read inquiries, return requests, and reply directly to customers.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">No support tickets found.</div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-5 flex justify-between items-start gap-4 hover:bg-gray-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{t.subject}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {t.status}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700 uppercase">
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{t.message}</p>
                    <p className="text-[11px] text-gray-400">
                      Customer: <strong>{t.customerName}</strong> ({t.customerEmail}) • {t.replies?.length || 0} replies
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Reply
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Administrative Security & Action Logs</h2>
            <p className="text-xs text-gray-500">Immutable audit records tracking changes to products, orders, and settings.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 divide-y divide-gray-100 text-xs">
            {auditLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-6">No audit records logged yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex justify-between items-center gap-4">
                  <div>
                    <span className="font-bold text-gray-900 font-mono">{log.action}</span>
                    <span className="text-gray-500 ml-2">Resource: {log.resource} ({log.resourceId})</span>
                    <p className="text-[11px] text-gray-400">Actor: {log.actorEmail}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 8: SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-base font-extrabold text-gray-900">Store Operational Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Delivery Charge: Inside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.deliveryChargeInsideDhaka}
                onChange={(e) => setSettings({ ...settings, deliveryChargeInsideDhaka: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Delivery Charge: Outside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.deliveryChargeOutsideDhaka}
                onChange={(e) => setSettings({ ...settings, deliveryChargeOutsideDhaka: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Free Delivery Threshold (৳)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">bKash Merchant Number</label>
              <input
                type="text"
                value={settings.bkashMerchantNumber}
                onChange={(e) => setSettings({ ...settings, bkashMerchantNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nagad Merchant Number</label>
              <input
                type="text"
                value={settings.nagadMerchantNumber}
                onChange={(e) => setSettings({ ...settings, nagadMerchantNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Top Announcement Banner Notice</label>
              <input
                type="text"
                value={settings.bannerNotice}
                onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              await saveStoreSettings(settings);
              setStatusMsg('Store settings saved.');
              setTimeout(() => setStatusMsg(null), 3000);
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Save Store Settings
          </button>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-gray-900">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Wireless Smart Watch"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Publication Status</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Comprehensive details, features, specifications..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Manage Order</span>
                <h3 className="text-base font-extrabold text-gray-900">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-gray-500">
                  Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fulfillment Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing & Packing</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Status</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="paid">Paid (Verified)</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Courier Partner</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Parcel">Pathao Parcel</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="Paperfly">Paperfly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Consignment / Tracking ID</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. SF-94829482"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Status
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-gray-100 shadow-2xl">
            <h3 className="text-sm font-extrabold text-gray-900">Restock Product</h3>
            <p className="text-xs text-gray-600">
              Adding units to <strong>{restockProduct.name}</strong>. Current stock: {restockProduct.stock}
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Add Units (+)</label>
              <input
                type="number"
                min={1}
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRestockSubmit}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                Confirm Restock
              </button>
              <button
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">{selectedTicket.subject}</h3>
                <p className="text-xs text-gray-500">From: {selectedTicket.customerName} ({selectedTicket.customerEmail})</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl text-xs text-gray-700">
              {selectedTicket.message}
            </div>

            <form onSubmit={handleAdminReplyTicket} className="space-y-3">
              <textarea
                rows={3}
                required
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="Write your response to the customer..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                Send Response to Customer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
