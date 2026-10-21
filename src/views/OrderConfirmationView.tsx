import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Printer, 
  ArrowRight, 
  ShoppingBag, 
  AlertCircle,
  Truck,
  Mail,
  Copy,
  Check
} from 'lucide-react';

interface OrderConfirmationViewProps {
  orderNumber: string;
  navigate: (route: string, param?: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ orderNumber, navigate }) => {
  const { getOrderById } = useStore();
  const [copied, setCopied] = React.useState(false);

  const order = getOrderById(orderNumber);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#C92520] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#272321]">Order Record Not Found</h1>
        <p className="text-xs text-[#6D6661]">
          We couldn't locate an order matching identifier "{orderNumber}". If you just placed an order, please check your customer account orders history.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-5 py-2.5 bg-[#C92520] text-white font-bold text-xs rounded-xl"
        >
          Return to Supermarket
        </button>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'verified';
  const amountPaid = isPaid ? order.grandTotal : 0;
  const amountDue = isPaid ? 0 : order.grandTotal;

  const trackingUrl = `${window.location.origin}/orders/${order.orderNumber}?token=${order.secureAccessToken}`;

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const statusSteps = [
    { key: 'received', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed by Store' },
    { key: 'packed', label: 'Packed' },
    { key: order.fulfillmentType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery', label: order.fulfillmentType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery' },
    { key: 'delivered', label: 'Completed' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.orderStatus);
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#23734B] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#641E24]">
            Malpani Sargam Super Mart
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#272321]">
            Order Confirmed & Registered!
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6661] max-w-lg mx-auto">
            Thank you, <strong>{order.customerName}</strong>. Your order basket has been safely accepted by <strong>{order.branchName}</strong>.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-3 bg-[#FFF9F4] rounded-xl border border-slate-200 text-xs">
          <div>
            Order Number: <strong className="font-mono text-[#C92520] text-sm">#{order.orderNumber}</strong>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div>
            Payment Status:{' '}
            {isPaid ? (
              <span className="text-[#23734B] font-bold">Payment Verified (Razorpay Ref: {order.razorpayPaymentId || 'RPZ-TEST'})</span>
            ) : (
              <span className="text-amber-700 font-bold">Payment Pending (Pay on Delivery)</span>
            )}
          </div>
        </div>

        {/* Transactional Email Notice */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 max-w-lg mx-auto flex items-center gap-2 text-left">
          <Mail className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            An automated transactional confirmation email has been logged and sent to <strong>{order.customerEmail}</strong> with full item details and tracking link.
          </span>
        </div>
      </div>

      {/* Order Status Progress Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-[#641E24] uppercase tracking-wider">
          Order Fulfillment Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div key={step.key} className="space-y-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted ? 'bg-[#23734B]' : 'bg-slate-200'
                  }`}
                />
                <div className="text-xs">
                  <div className={`font-bold ${isCurrent ? 'text-[#C92520]' : isCompleted ? 'text-[#23734B]' : 'text-slate-400'}`}>
                    {step.label}
                  </div>
                  {isCurrent && (
                    <div className="text-[10px] text-slate-500 font-medium">In Progress</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#EF8018] shrink-0" />
          <span>
            <strong>Fulfillment Estimate:</strong> {order.estimatedFulfillmentTime || 'Within 2-3 hours'}
          </span>
        </div>
      </div>

      {/* Full Order Details & Items Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        
        {/* Header with Print action */}
        <div className="p-6 bg-[#FFF9F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#272321]">Itemized Purchase Summary</h3>
            <p className="text-xs text-[#6D6661]">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Fulfillment & Address Strip */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div>
            <h4 className="font-bold text-[#641E24] uppercase tracking-wider text-[11px] mb-1">
              Fulfilling Supermarket Branch
            </h4>
            <div className="font-bold text-sm text-[#272321]">{order.branchName}</div>
            <div className="text-[#6D6661] mt-0.5">Sangamner, Maharashtra</div>
          </div>

          <div>
            <h4 className="font-bold text-[#641E24] uppercase tracking-wider text-[11px] mb-1">
              {order.fulfillmentType === 'delivery' ? 'Delivery Destination' : 'Pickup Instructions'}
            </h4>
            {order.fulfillmentType === 'delivery' && order.deliveryAddress ? (
              <div>
                <div className="font-semibold text-slate-800">
                  {order.deliveryAddress.street}, {order.deliveryAddress.area}
                </div>
                <div className="text-[#6D6661]">
                  {order.deliveryAddress.city} – {order.deliveryAddress.pincode}
                </div>
                {order.deliveryInstructions && (
                  <div className="text-[11px] text-slate-500 mt-1 italic">
                    Note: "{order.deliveryInstructions}"
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="font-semibold text-slate-800">Express Customer Service Counter</span>
                <p className="text-[#6D6661] mt-0.5">Please show order #{order.orderNumber} for instant pickup.</p>
              </div>
            )}
          </div>
        </div>

        {/* Item Rows */}
        <div className="p-6 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 flex justify-between">
            <span>Item Details</span>
            <span>Subtotal</span>
          </div>

          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <div>
                <div className="font-bold text-[#272321]">{item.name}</div>
                <div className="text-[11px] text-[#6D6661]">
                  {item.packSize} · Qty: <strong>{item.quantity}</strong> × ₹{item.unitPrice}
                </div>
              </div>
              <span className="font-bold text-[#272321] tabular-nums">
                ₹{item.total}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="p-6 bg-slate-50/70 space-y-2 text-xs text-slate-700">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <span className="font-semibold tabular-nums">₹{order.subtotal}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-[#23734B] font-semibold">
              <span>Promotional Discount:</span>
              <span className="tabular-nums">-₹{order.discountTotal}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span className="font-semibold tabular-nums">
              {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm">
            <span className="text-[#272321]">Total Order Amount:</span>
            <span className="text-xl text-[#C92520] tabular-nums">₹{order.grandTotal}</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
            <span>Amount Paid: ₹{amountPaid}</span>
            <span className={amountDue > 0 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
              Amount Due: ₹{amountDue}
            </span>
          </div>
        </div>
      </div>

      {/* Share / Copy Tracking Link */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          <strong>Private Tracking URL:</strong> Keep this link to view status updates at any time.
        </div>
        <button
          onClick={copyTrackingLink}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 font-bold flex items-center gap-1.5 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Tracking Link'}</span>
        </button>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('shop')}
          className="w-full sm:w-auto px-6 py-3 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <button
          onClick={() => navigate('account')}
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
        >
          View All My Orders
        </button>
      </div>

    </div>
  );
};
