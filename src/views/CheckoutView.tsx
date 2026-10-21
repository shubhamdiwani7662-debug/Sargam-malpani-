import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FulfillmentType, PaymentMethod } from '../types';
import { 
  generateTestOrderId, 
  generateTestPaymentId, 
  generateTestSignature, 
  verifyPaymentSignature 
} from '../utils/razorpay';
import { 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  AlertCircle,
  MapPin,
  Lock,
  Loader2
} from 'lucide-react';

interface CheckoutViewProps {
  navigate: (route: string, param?: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ navigate }) => {
  const { 
    cart, 
    cartSubtotal, 
    orderDiscount, 
    deliveryFee, 
    cartGrandTotal, 
    selectedBranch, 
    customer, 
    createOrder 
  } = useStore();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [customerName, setCustomerName] = useState(customer?.name || 'Ramesh Patil');
  const [customerEmail, setCustomerEmail] = useState(customer?.email || 'ramesh.patil@example.com');
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '+91 98221 44556');
  
  // Delivery Address
  const defaultAddr = customer?.savedAddresses[0];
  const [street, setStreet] = useState(defaultAddr?.street || 'Flat 402, Sai Vihar Apartment, Sangamner-Pune Road');
  const [area, setArea] = useState(defaultAddr?.area || 'Malpani Nagar');
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || 'Behind Sargam Central Mart');
  const [city, setCity] = useState(defaultAddr?.city || 'Sangamner');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '422605');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [testUpiId, setTestUpiId] = useState('success@razorpay');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (cart.length === 0) {
    navigate('cart');
    return null;
  }

  // Branch validation
  const isBranchOrderingDisabled = !selectedBranch || !selectedBranch.orderingEnabled;
  const isDeliveryDisabled = fulfillmentType === 'delivery' && !selectedBranch?.deliveryEnabled;

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isBranchOrderingDisabled) {
      setErrorMsg(`Online ordering is currently unavailable at ${selectedBranch?.name || 'selected store'}.`);
      return;
    }

    if (isDeliveryDisabled) {
      setErrorMsg(`Home delivery is suspended for ${selectedBranch?.name}. Please choose Store Pickup.`);
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Please fill in your name, email, and mobile contact number.');
      return;
    }

    if (fulfillmentType === 'delivery' && (!street || !area || !pincode)) {
      setErrorMsg('Please provide your complete delivery street, area, and pincode.');
      return;
    }

    if (paymentMethod === 'razorpay') {
      // Open Razorpay test gateway simulation modal
      setShowRazorpayModal(true);
    } else {
      // Cash on Delivery
      executeOrderCreation('cod', 'pending');
    }
  };

  const handleRazorpayTestPayment = async () => {
    setIsProcessing(true);
    // Simulate Razorpay Gateway authentication & signature creation
    await new Promise((r) => setTimeout(r, 900));

    const testOrderId = generateTestOrderId();
    const testPaymentId = generateTestPaymentId();
    const testSignature = generateTestSignature(testOrderId, testPaymentId);

    // Cryptographic signature check
    const isVerified = verifyPaymentSignature(testOrderId, testPaymentId, testSignature);

    if (isVerified) {
      setShowRazorpayModal(false);
      await executeOrderCreation('razorpay', 'verified', testPaymentId, testOrderId, testSignature);
    } else {
      setIsProcessing(false);
      setErrorMsg('Payment verification failed on the gateway. Please retry.');
    }
  };

  const executeOrderCreation = async (
    method: PaymentMethod,
    payStatus: 'pending' | 'verified',
    paymentId?: string,
    orderId?: string,
    signature?: string
  ) => {
    setIsProcessing(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        packSize: item.packSize,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        mrp: item.mrp,
        total: item.unitPrice * item.quantity,
      }));

      const finalDeliveryFee = fulfillmentType === 'pickup' ? 0 : deliveryFee;
      const finalGrandTotal = Math.max(0, cartSubtotal - orderDiscount + finalDeliveryFee);

      const created = await createOrder({
        branchId: selectedBranch?.id || 'branch-1',
        branchName: selectedBranch?.name || 'Sangamner Central Flagship Mart',
        customerName,
        customerEmail,
        customerPhone,
        fulfillmentType,
        deliveryAddress:
          fulfillmentType === 'delivery'
            ? { street, area, landmark, city, pincode }
            : undefined,
        deliveryInstructions: deliveryInstructions || undefined,
        items: orderItems,
        itemCount: cart.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: cartSubtotal,
        discountTotal: orderDiscount,
        deliveryFee: finalDeliveryFee,
        taxTotal: 0,
        grandTotal: finalGrandTotal,
        paymentMethod: method,
        paymentStatus: payStatus,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        orderStatus: 'received',
      });

      // Redirect to Order Confirmation View
      navigate('order-confirmation', created.orderNumber);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#C92520] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart Basket</span>
        </button>
      </div>

      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight">
          Secure Supermarket Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#6D6661]">
          Fulfilling from: <strong>{selectedBranch?.name || 'Sangamner Central Mart'}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Details, Fulfillment, Address */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fulfillment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#641E24] uppercase tracking-wider">
              1. Choose Fulfillment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#C92520] bg-[#FFF9F4]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentType === 'delivery'}
                  onChange={() => setFulfillmentType('delivery')}
                  className="mt-1 text-[#C92520] focus:ring-[#C92520]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#272321]">
                    <Truck className="w-4 h-4 text-[#C92520]" />
                    <span>Home Delivery</span>
                  </div>
                  <p className="text-xs text-[#6D6661] mt-1">
                    Delivered to your residence or shop in Sangamner ({deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}).
                  </p>
                </div>
              </label>

              <label
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#C92520] bg-[#FFF9F4]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentType === 'pickup'}
                  onChange={() => setFulfillmentType('pickup')}
                  className="mt-1 text-[#C92520] focus:ring-[#C92520]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#272321]">
                    <ShoppingBag className="w-4 h-4 text-[#EF8018]" />
                    <span>Store Self-Pickup</span>
                  </div>
                  <p className="text-xs text-[#6D6661] mt-1">
                    Ready at customer service desk in 45-60 mins (FREE).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#641E24] uppercase tracking-wider">
              2. Contact & Notification Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (For Instant Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address (only if Home Delivery) */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#641E24] uppercase tracking-wider">
                3. Delivery Address (Sangamner Region)
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Flat / Building / House / Street *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Flat 301, Ganesh Park"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Locality *</label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Malpani Nagar / Ghulewadi"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Water Tank"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      readOnly
                      value={city}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Ring the bell, leave at security, or call before arriving"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#641E24] uppercase tracking-wider">
              {fulfillmentType === 'delivery' ? '4. Payment Method' : '3. Payment Method'}
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#C92520] bg-[#FFF9F4]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="text-[#C92520] focus:ring-[#C92520]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#272321] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#C92520]" />
                      <span>Razorpay Online Gateway (Instant Verification)</span>
                    </div>
                    <p className="text-xs text-[#6D6661] mt-0.5">
                      Pay securely via Google Pay / PhonePe UPI, Cards, or Netbanking.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Recommended
                </span>
              </label>

              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#C92520] bg-[#FFF9F4]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#C92520] focus:ring-[#C92520]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#272321] flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#23734B]" />
                      <span>{fulfillmentType === 'pickup' ? 'Pay at Counter' : 'Pay on Delivery (Cash/UPI)'}</span>
                    </div>
                    <p className="text-xs text-[#6D6661] mt-0.5">
                      Pay ₹{cartGrandTotal} when you receive your groceries.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary: Snapshot & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-bold text-base text-[#272321] pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-slate-500 font-normal">
                {cart.length} unique items
              </span>
            </h3>

            {/* Itemized snapshot preview */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.productId} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.packSize} × {item.quantity}
                    </div>
                  </div>
                  <span className="font-bold text-[#272321] tabular-nums shrink-0 ml-2">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{cartSubtotal}</span>
              </div>
              {orderDiscount > 0 && (
                <div className="flex justify-between text-[#23734B] font-semibold">
                  <span>Coupon Discount:</span>
                  <span className="tabular-nums">-₹{orderDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Fulfillment ({fulfillmentType === 'delivery' ? 'Home Delivery' : 'Pickup'}):</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {fulfillmentType === 'pickup' || deliveryFee === 0 ? (
                    <span className="text-[#23734B] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-[#272321]">Total Payable</span>
                  <div className="text-[10px] text-slate-400">Calculated with live store rates</div>
                </div>
                <span className="text-2xl font-extrabold text-[#C92520] tabular-nums">
                  ₹{cartGrandTotal}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'razorpay'
                      ? `Pay ₹${cartGrandTotal} via Razorpay`
                      : `Confirm Order (₹${cartGrandTotal})`}
                  </span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#23734B]" />
              <span>100% Secure Checkout · Verified Local Mart Delivery</span>
            </div>
          </div>
        </div>

      </form>

      {/* RAZORPAY TEST GATEWAY SIMULATOR MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Razorpay Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-wide text-[#3395ff]">Razorpay</span>
                  <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded">Test Mode</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">Malpani Sargam Super Mart</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-mono">₹{cartGrandTotal}</div>
                <div className="text-[10px] text-slate-300">Order ID: SGM-PAY-TEST</div>
              </div>
            </div>

            {/* Razorpay Body */}
            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <strong>Razorpay Sandbox Simulation:</strong> You are testing the payment flow in verified test mode. No real money is deducted.
              </div>

              {/* Method tabs */}
              <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('upi')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    razorpayMethod === 'upi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  UPI (GPay/PhonePe)
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('card')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    razorpayMethod === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('netbanking')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    razorpayMethod === 'netbanking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Netbanking
                </button>
              </div>

              {razorpayMethod === 'upi' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={testUpiId}
                    onChange={(e) => setTestUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 font-mono"
                  />
                  <div className="text-[11px] text-slate-400">
                    Use <strong className="text-slate-700">success@razorpay</strong> for instant authorized payment.
                  </div>
                </div>
              )}

              {razorpayMethod === 'card' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Test Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="4111 ···· ···· 1111"
                      className="w-full px-3 py-2 bg-slate-50 border rounded font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" readOnly value="12/28" className="px-3 py-2 bg-slate-50 border rounded font-mono" />
                    <input type="text" readOnly value="123" className="px-3 py-2 bg-slate-50 border rounded font-mono" />
                  </div>
                </div>
              )}

              {razorpayMethod === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="block text-slate-600">Select Bank</label>
                  <select className="w-full px-3 py-2 border rounded bg-white">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Bank of Baroda</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRazorpayTestPayment}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[#3395ff] hover:bg-[#207eed] rounded-lg shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Authorize Test Pay</span>
                  )}
                </button>
              </div>
            </div>

            {/* Razorpay Footer */}
            <div className="bg-slate-50 p-3 text-center border-t border-slate-100 text-[10px] text-slate-400">
              Secured by 256-Bit SSL Encryption · RBI Compliant Sandbox
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
