import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Truck, 
  MapPin, 
  AlertCircle, 
  Check,
  ShieldCheck
} from 'lucide-react';

interface CartViewProps {
  navigate: (route: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ navigate }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartCount, 
    cartSubtotal, 
    cartMrpTotal, 
    cartSavings, 
    deliveryFee, 
    appliedOffer, 
    applyOfferCode, 
    removeOffer,
    cartGrandTotal,
    selectedBranch,
    setIsBranchModalOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const freeThreshold = selectedBranch?.freeDeliveryThreshold ?? 499;
  const amountToFreeDelivery = Math.max(0, freeThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyOfferCode(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  if (cartCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-50 text-[#C92520] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#272321]">
          Your Grocery Basket is Empty
        </h1>
        <p className="text-sm text-[#6D6661] max-w-md mx-auto">
          Explore thousands of household essentials, fresh dairy, pure flours, and farm staples from our Sangamner store network.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-3.5 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Start Shopping Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight">
            Review Your Grocery Basket ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-[#6D6661]">
            <span>Fulfilling Store:</span>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="text-[#C92520] font-bold hover:underline flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedBranch?.name || 'Central Flagship Mart'}</span>
              <span className="text-[11px]">(Change)</span>
            </button>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Empty Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Delivery Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#272321]">
                <Truck className="w-4 h-4 text-[#23734B]" />
                {amountToFreeDelivery === 0 ? (
                  <span className="text-[#23734B] font-bold">You have qualified for FREE Home Delivery!</span>
                ) : (
                  <span>Add <strong>₹{amountToFreeDelivery}</strong> more to get FREE Delivery</span>
                )}
              </span>
              <span className="font-mono text-slate-500">{deliveryProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#23734B] h-full transition-all duration-300 rounded-full"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items Table/Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.productId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Item Details */}
                <div className="flex-1 space-y-1">
                  <div className="text-[11px] font-bold text-[#641E24] uppercase tracking-wider">
                    {item.brand}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#272321]">
                    {item.name}
                  </h3>
                  <div className="text-xs text-[#6D6661]">
                    Pack: <strong className="text-slate-800">{item.packSize}</strong> · SKU: <span className="font-mono text-[11px]">{item.barcode}</span>
                  </div>
                </div>

                {/* Price, Stepper & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-extrabold text-[#272321] tabular-nums">
                      ₹{item.unitPrice * item.quantity}
                    </div>
                    {item.mrp > item.unitPrice && (
                      <div className="text-[11px] text-slate-400 line-through tabular-nums">
                        MRP ₹{item.mrp * item.quantity}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:text-red-600 shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#272321] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[#C92520] flex items-center justify-center text-white hover:bg-[#B01E1A] shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Delivery Note */}
          <div className="p-4 bg-[#FFF9F4] rounded-xl border border-slate-200 text-xs text-[#6D6661] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#23734B] shrink-0 mt-0.5" />
            <span>
              All groceries are packed in sealed, food-grade biodegradable bags and checked for seal integrity before leaving the supermarket counter.
            </span>
          </div>

        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-[#641E24] uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#EF8018]" />
              <span>Apply Store Coupon</span>
            </h3>

            {appliedOffer ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{appliedOffer.code} Applied</span>
                  <p className="text-[11px] text-emerald-700">{appliedOffer.title}</p>
                </div>
                <button
                  onClick={removeOffer}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. SARGAM50)"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#272321] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && (
              <div className={`text-xs ${couponMessage.isError ? 'text-red-600' : 'text-emerald-700 font-semibold'}`}>
                {couponMessage.text}
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-500">
              Try: <span className="font-mono font-bold text-slate-700">SARGAM50</span> (₹50 off &gt;₹499) or <span className="font-mono font-bold text-slate-700">SUPER100</span> (₹100 off &gt;₹1299)
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#272321] border-b border-slate-100 pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#272321] tabular-nums">₹{cartSubtotal}</span>
              </div>

              {cartSavings > 0 && (
                <div className="flex justify-between text-[#23734B] font-semibold">
                  <span>Total Mart Savings:</span>
                  <span className="tabular-nums">-₹{cartSavings}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Fee:</span>
                <span className="font-semibold text-[#272321] tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-[#23734B] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>GST & State Taxes:</span>
                <span>Included in MRP</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-[#272321]">To Pay</span>
                  <div className="text-[10px] text-slate-400">Final verifiable checkout amount</div>
                </div>
                <span className="text-2xl font-extrabold text-[#C92520] tabular-nums">
                  ₹{cartGrandTotal}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
