export type FulfillmentType = 'delivery' | 'pickup';
export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';
export type OrderStatus = 
  | 'received' 
  | 'confirmed' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'ready_for_pickup' 
  | 'delivered' 
  | 'cancelled';

export type StaffRole = 'OWNER' | 'BRANCH_MANAGER' | 'PRODUCT_STAFF' | 'ORDER_STAFF';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  timings: string;
  isOpen: boolean;
  orderingEnabled: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  serviceAreas: string[];
  orderingHours: {
    start: string; // e.g. "08:00"
    end: string;   // e.g. "21:00"
  };
  pauseNotice?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  subcategories: string[];
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  subcategory: string;
  packSize: string;
  mrp: number;
  sellingPrice: number;
  offerPrice?: number;
  offerLabel?: string;
  barcode: string;
  sku: string;
  description: string;
  features: string[];
  dietary: 'veg' | 'non-veg' | 'general';
  inStock: boolean;
  branchInventory: Record<string, number>; // branchId -> stock count
  branchPrices?: Record<string, number>;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  unit: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  packSize: string;
  mrp: number;
  unitPrice: number;
  quantity: number;
  branchId: string;
  image?: string;
  barcode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  total: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SGM-2026-7842"
  secureAccessToken: string; // Unguessable token for privacy
  branchId: string;
  branchName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: {
    street: string;
    area: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  deliveryInstructions?: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  taxTotal: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  estimatedFulfillmentTime?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branchId?: string;
  branchName?: string;
  phone: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface EmailOutboxItem {
  id: string;
  orderId: string;
  orderNumber: string;
  recipientEmail: string;
  recipientName: string;
  eventType: 
    | 'order_received' 
    | 'payment_confirmed' 
    | 'order_confirmed' 
    | 'order_packed' 
    | 'out_for_delivery' 
    | 'order_completed' 
    | 'order_cancelled';
  subject: string;
  htmlContent: string;
  status: 'sent' | 'pending' | 'failed';
  attemptCount: number;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: {
    id: string;
    tag: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    pincode: string;
    isDefault: boolean;
  }[];
  wishlist: string[];
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  validUntil: string;
  isActive: boolean;
  bannerColor: string;
}
