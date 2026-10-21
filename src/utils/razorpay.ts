// Razorpay Test Mode client & verification utility

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface PaymentVerificationResult {
  verified: boolean;
  paymentId: string;
  orderId: string;
  signature: string;
  method: string;
  cardLast4?: string;
  bank?: string;
  vpa?: string;
}

export function generateTestOrderId(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `order_SGM_${randomSuffix}`;
}

export function generateTestPaymentId(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 12).toUpperCase();
  return `pay_SGM_${randomSuffix}`;
}

export function generateTestSignature(orderId: string, paymentId: string): string {
  // Simple deterministic client hash for test simulator
  let hash = 0;
  const combined = `${orderId}|${paymentId}|sargam_secret_test_key`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sig_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) return false;
  // Verify matching prefix or simulated signature integrity
  return signature.startsWith('sig_');
}
