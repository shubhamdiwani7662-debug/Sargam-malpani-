import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  LogOut,
  ExternalLink
} from 'lucide-react';

interface CustomerAccountViewProps {
  navigate: (route: string, param?: string) => void;
}

export const CustomerAccountView: React.FC<CustomerAccountViewProps> = ({ navigate }) => {
  const { 
    customer, 
    customerLogin, 
    customerLogout, 
    orders, 
    wishlist, 
    products, 
    addToCart,
    updateCustomerAddress 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  // New address state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newTag, setNewTag] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPincode, setNewPincode] = useState('422605');

  const customerOrders = orders.filter(
    (o) =>
      customer &&
      (o.customerEmail.toLowerCase() === customer.email.toLowerCase() ||
        o.customerPhone === customer.phone)
  );

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginEmail || !loginPhone) return;
    customerLogin(loginName, loginEmail, loginPhone);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newArea) return;
    updateCustomerAddress({
      id: `addr_${Date.now()}`,
      tag: newTag,
      street: newStreet,
      area: newArea,
      city: 'Sangamner',
      pincode: newPincode,
      isDefault: false,
    });
    setShowAddAddress(false);
    setNewStreet('');
    setNewArea('');
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    navigate('cart');
  };

  // If not logged in, show customer sign in
  if (!customer) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C92520] flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#272321]">Customer Account Sign In</h1>
            <p className="text-xs text-[#6D6661]">
              Access your past orders, delivery addresses, and saved grocery list.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *</label>
              <input
                type="tel"
                required
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="+91 98221 00000"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In to My Account
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Guest ordering is also available directly at checkout without prior sign up.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Account Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9F4] border border-slate-200 flex items-center justify-center text-[#C92520] font-extrabold text-xl">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#272321]">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6D6661] mt-0.5">
              <span>{customer.email}</span>
              <span>·</span>
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>

        <button
          onClick={customerLogout}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#C92520] text-[#C92520]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-[#C92520] text-[#C92520]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({customer.savedAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-[#C92520] text-[#C92520]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#272321]">No Previous Orders Yet</h3>
              <p className="text-xs text-[#6D6661] max-w-sm mx-auto">
                Once you place an order online, full tracking status, invoices, and reorder options will appear here.
              </p>
              <button
                onClick={() => navigate('shop')}
                className="px-4 py-2 bg-[#C92520] text-white text-xs font-bold rounded-lg"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#C92520]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#641E24]">
                        {order.branchName}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6D6661] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 capitalize">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#23734B]" />
                      <span>{order.orderStatus.replace('_', ' ')}</span>
                    </span>

                    <span className="font-extrabold text-base text-[#272321] tabular-nums">
                      ₹{order.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="text-xs space-y-1.5 text-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name} ({item.packSize}) × {item.quantity}</span>
                      <span className="font-semibold tabular-nums">₹{item.total}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => navigate('order-confirmation', order.orderNumber)}
                    className="font-bold text-[#C92520] hover:underline flex items-center gap-1"
                  >
                    <span>View Tracking & Receipt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-slate-100 hover:bg-[#C92520] hover:text-white text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder Basket</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#272321]">Saved Delivery Locations</h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-3.5 py-2 bg-[#C92520] text-white text-xs font-bold rounded-lg hover:bg-[#B01E1A] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-[#641E24]">New Sangamner Address</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Tag (Home/Office)</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Flat / Building / Street *</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Area / Locality *</label>
                <input
                  type="text"
                  required
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 bg-slate-100 rounded text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C92520] text-white rounded font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customer.savedAddresses.map((addr) => (
              <div key={addr.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#641E24] uppercase tracking-wider">{addr.tag}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-800 font-semibold">{addr.street}</p>
                <p className="text-[#6D6661]">{addr.area}, {addr.city} – {addr.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#272321]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#6D6661]">
                Save staple groceries and seasonal favorites to quickly re-add them to your cart.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-[#641E24] uppercase">{p.brand}</span>
                    <h4 className="font-bold text-sm text-[#272321]">{p.name}</h4>
                    <span className="text-slate-500">{p.packSize}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-base text-[#272321] tabular-nums">
                      ₹{p.offerPrice ?? p.sellingPrice}
                    </span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-3 py-1.5 bg-[#C92520] text-white font-bold rounded-lg hover:bg-[#B01E1A]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
