/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Headphones,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  CheckCircle,
  Plus,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, SupportTicket } from '../types';
import {
  fetchCustomerOrders,
  fetchCustomerTickets,
  createSupportTicket,
  replySupportTicket
} from '../services/storeService';

interface CustomerAccountPageProps {
  onTrackOrder: (orderNumber: string) => void;
  onOpenAuth: () => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  onTrackOrder,
  onOpenAuth
}) => {
  const { user, userProfile, updateUserProfileData } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form State
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<SupportTicket['priority']>('normal');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (user?.uid) {
      loadOrders();
      loadTickets();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.uid) return;
    setLoadingOrders(true);
    try {
      const list = await fetchCustomerOrders(user.uid);
      setOrders(list || []);
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadTickets = async () => {
    if (!user?.uid) return;
    setLoadingTickets(true);
    try {
      const list = await fetchCustomerTickets(user.uid);
      setTickets(list || []);
    } catch (err) {
      console.warn('Tickets fetch error:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMessage(null);
    try {
      await updateUserProfileData({
        displayName: displayName.trim(),
        phone: phone.trim(),
        address: address.trim()
      });
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err: any) {
      setProfileMessage('Failed to update profile: ' + err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTicketSubject.trim() || !newTicketMessage.trim()) return;
    try {
      await createSupportTicket({
        customerId: user.uid,
        customerEmail: user.email || '',
        customerName: userProfile?.displayName || user.email?.split('@')[0] || 'Customer',
        subject: newTicketSubject.trim(),
        message: newTicketMessage.trim(),
        priority: newTicketPriority,
        status: 'open'
      });
      setNewTicketSubject('');
      setNewTicketMessage('');
      setShowNewTicketModal(false);
      await loadTickets();
    } catch (err: any) {
      alert('Error creating support ticket: ' + err.message);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim() || !user) return;
    setSubmittingReply(true);
    try {
      await replySupportTicket(selectedTicket.id, {
        senderId: user.uid,
        senderName: userProfile?.displayName || 'Customer',
        senderRole: 'customer',
        message: replyMessage.trim()
      });
      setReplyMessage('');
      await loadTickets();
      // Update local view
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              replies: [
                ...(prev.replies || []),
                {
                  senderId: user.uid,
                  senderName: userProfile?.displayName || 'Customer',
                  senderRole: 'customer',
                  message: replyMessage.trim(),
                  timestamp: new Date().toISOString()
                }
              ]
            }
          : null
      );
    } catch (err: any) {
      alert('Reply error: ' + err.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Customer Account Access</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Sign in to view your verified orders, track active shipments, manage delivery addresses, and reach our support helpdesk.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Account</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your orders, personal details, and customer support conversations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 space-x-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Address</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'support'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Helpdesk & Support ({tickets.length})</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="p-8 text-center text-xs text-gray-400">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Explore our featured catalog to place your first order with nationwide cash on delivery!
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-emerald-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-gray-100 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-0.5 block">
                      {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-gray-900">৳{ord.total.toLocaleString()}</span>
                    <button
                      onClick={() => onTrackOrder(ord.orderNumber)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="flex flex-wrap gap-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded-xl">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={item.productName}
                        className="w-8 h-8 rounded-lg object-cover bg-white"
                      />
                      <span className="font-medium text-gray-800 max-w-[140px] truncate">{item.productName}</span>
                      <span className="text-gray-400">× {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs max-w-xl">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {profileMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={user.email || ''}
                className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Managed via Firebase Authentication</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Bangladesh)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Delivery Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Area, District..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Support Tickets */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Support Tickets & Inquiry Threads</h2>
              <p className="text-xs text-gray-500">Submit requests for cancellations, returns, delivery updates or inquiries.</p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Ticket</span>
            </button>
          </div>

          {/* Ticket Threads */}
          <div className="space-y-4">
            {loadingTickets ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xs">
                <Headphones className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-gray-800">No Support Inquiries</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Need help with an order, return, or product? Open a support ticket and our team in Dhaka will assist you promptly.
                </p>
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-emerald-200 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{t.subject}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {t.status}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 uppercase">
                          Priority: {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{t.message}</p>
                      <span className="text-[11px] text-gray-400 mt-2 block">
                        Created {new Date(t.createdAt).toLocaleDateString('en-GB')} • {t.replies?.length || 0} replies
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 shadow-xl">
            <h3 className="text-sm font-extrabold text-gray-900">Create New Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Delivery query for order ZX-849201"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={newTicketPriority}
                  onChange={(e) => setNewTicketPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  placeholder="Please describe your query, order issue, or replacement request..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Reply Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border border-gray-100 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Ticket Ref #{selectedTicket.id}</span>
                <h3 className="text-base font-extrabold text-gray-900">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {selectedTicket.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 text-xs">
              {/* Initial message */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>{selectedTicket.customerName}</span>
                  <span className="text-gray-400 font-normal">
                    {new Date(selectedTicket.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedTicket.message}</p>
              </div>

              {/* Replies */}
              {selectedTicket.replies?.map((rep, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs ${
                    rep.senderRole === 'admin'
                      ? 'bg-emerald-50 border border-emerald-100 ml-4'
                      : 'bg-gray-50 border border-gray-100 mr-4'
                  }`}
                >
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className={rep.senderRole === 'admin' ? 'text-emerald-900' : 'text-gray-900'}>
                      {rep.senderName} {rep.senderRole === 'admin' && '(ZonixShop Support Support Specialist)'}
                    </span>
                    <span className="text-gray-400 font-normal">
                      {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{rep.message}</p>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <form onSubmit={handleSendReply} className="pt-2 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                disabled={submittingReply || !replyMessage.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
