import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Branch, 
  Category, 
  Product, 
  CartItem, 
  Order, 
  StaffUser, 
  EmailOutboxItem, 
  CustomerUser, 
  Offer,
  OrderStatus 
} from '../types';
import { 
  INITIAL_BRANCHES, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_STAFF_USERS, 
  INITIAL_OFFERS 
} from '../data/initialData';
import { generateEmailHtml } from '../utils/emailTemplates';

interface StoreContextType {
  // Branches
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  updateBranch: (branch: Branch) => void;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  addProduct: (prod: Product) => void;
  updateProduct: (prod: Product) => void;
  deleteProduct: (id: string) => void;
  updateBranchStock: (productId: string, branchId: string, newStock: number) => void;

  // Offers
  offers: Offer[];
  appliedOffer: Offer | null;
  applyOfferCode: (code: string) => { success: boolean; message: string; discount: number };
  removeOffer: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartMrpTotal: number;
  cartSavings: number;
  deliveryFee: number;
  orderDiscount: number;
  cartGrandTotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'secureAccessToken' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<boolean>;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;

  // Customer Auth & Profile
  customer: CustomerUser | null;
  customerLogin: (name: string, email: string, phone: string) => void;
  customerLogout: () => void;
  updateCustomerAddress: (address: CustomerUser['savedAddresses'][0]) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Staff & Admin Auth
  staffUser: StaffUser | null;
  staffLogin: (email: string, role?: StaffUser['role']) => boolean;
  staffLogout: () => void;
  staffList: StaffUser[];
  updateStaffUser: (user: StaffUser) => void;
  addStaffUser: (user: StaffUser) => void;

  // Email Outbox
  emailOutbox: EmailOutboxItem[];
  retryEmail: (emailId: string) => Promise<boolean>;
  sendEmailForEvent: (order: Order, eventType: EmailOutboxItem['eventType']) => Promise<EmailOutboxItem>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with LocalStorage persistence fallback
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('sgm_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(() => {
    const saved = localStorage.getItem('sgm_selected_branch');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BRANCHES[0];
      }
    }
    return INITIAL_BRANCHES[0]; // Default to Central Flagship
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sgm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [offers] = useState<Offer[]>(INITIAL_OFFERS);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sgm_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sgm_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [emailOutbox, setEmailOutbox] = useState<EmailOutboxItem[]>(() => {
    const saved = localStorage.getItem('sgm_emails');
    return saved ? JSON.parse(saved) : [];
  });

  const [staffUser, setStaffUser] = useState<StaffUser | null>(() => {
    const saved = localStorage.getItem('sgm_staff');
    return saved ? JSON.parse(saved) : null;
  });

  const [staffList, setStaffList] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem('sgm_staff_list');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
  });

  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('sgm_customer');
    return saved ? JSON.parse(saved) : {
      id: 'cust-guest',
      name: 'Ramesh Patil',
      email: 'ramesh.patil@example.com',
      phone: '+91 98221 44556',
      savedAddresses: [
        {
          id: 'addr-1',
          tag: 'Home',
          street: 'Flat 402, Sai Vihar Apartment, Sangamner-Pune Road',
          area: 'Malpani Nagar',
          landmark: 'Behind Sargam Central Mart',
          city: 'Sangamner',
          pincode: '422605',
          isDefault: true,
        }
      ],
      wishlist: ['prod-1', 'prod-5', 'prod-7'],
      createdAt: new Date().toISOString(),
    };
  });

  const [wishlist, setWishlist] = useState<string[]>(() => customer?.wishlist || []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sgm_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('sgm_selected_branch', JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]);

  useEffect(() => {
    localStorage.setItem('sgm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sgm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sgm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sgm_emails', JSON.stringify(emailOutbox));
  }, [emailOutbox]);

  useEffect(() => {
    if (staffUser) {
      localStorage.setItem('sgm_staff', JSON.stringify(staffUser));
    } else {
      localStorage.removeItem('sgm_staff');
    }
  }, [staffUser]);

  useEffect(() => {
    localStorage.setItem('sgm_staff_list', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    if (customer) {
      localStorage.setItem('sgm_customer', JSON.stringify(customer));
    }
  }, [customer]);

  // Branch setter with validation
  const setSelectedBranch = (branch: Branch | null) => {
    setSelectedBranchState(branch);
    // If branch changes, check items in cart and keep sync
    if (branch && cart.length > 0) {
      setCart((prev) =>
        prev.map((item) => ({
          ...item,
          branchId: branch.id,
        }))
      );
    }
  };

  const updateBranch = (updated: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selectedBranch?.id === updated.id) {
      setSelectedBranchState(updated);
    }
  };

  // Product management
  const addProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateBranchStock = (productId: string, branchId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedInv = { ...p.branchInventory, [branchId]: Math.max(0, newStock) };
          return {
            ...p,
            branchInventory: updatedInv,
            inStock: Object.values(updatedInv).some((cnt) => cnt > 0),
          };
        }
        return p;
      })
    );
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1): boolean => {
    const currentBranchId = selectedBranch?.id || 'branch-1';
    const availableStock = product.branchInventory[currentBranchId] ?? 0;

    if (availableStock <= 0) {
      return false;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.id);
      const priceToUse = product.offerPrice ?? product.sellingPrice;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, availableStock);
        return prevCart.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          packSize: product.packSize,
          mrp: product.mrp,
          unitPrice: priceToUse,
          quantity: Math.min(quantity, availableStock),
          branchId: currentBranchId,
          image: product.image,
          barcode: product.barcode,
        };
        return [...prevCart, newItem];
      }
    });

    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentBranchId = selectedBranch?.id || 'branch-1';
    const product = products.find((p) => p.id === productId);
    const availableStock = product ? product.branchInventory[currentBranchId] ?? 99 : 99;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, availableStock) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedOffer(null);
  };

  // Cart math
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartMrpTotal = cart.reduce((acc, item) => acc + item.mrp * item.quantity, 0);

  // Delivery fee calculation
  const freeThreshold = selectedBranch?.freeDeliveryThreshold ?? 499;
  const standardFee = selectedBranch?.deliveryFee ?? 30;
  const deliveryFee = cartSubtotal >= freeThreshold || cartSubtotal === 0 ? 0 : standardFee;

  // Offer calculation
  let orderDiscount = 0;
  if (appliedOffer) {
    if (appliedOffer.discountType === 'flat') {
      orderDiscount = appliedOffer.discountValue;
    } else {
      orderDiscount = Math.round((cartSubtotal * appliedOffer.discountValue) / 100);
    }
  }

  const cartSavings = Math.max(0, cartMrpTotal - cartSubtotal) + orderDiscount;
  const cartGrandTotal = Math.max(0, cartSubtotal - orderDiscount + deliveryFee);

  const applyOfferCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const offer = offers.find((o) => o.code === trimmed && o.isActive);

    if (!offer) {
      return { success: false, message: 'Invalid or expired coupon code.', discount: 0 };
    }

    if (cartSubtotal < offer.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value for ${offer.code} is ₹${offer.minOrderValue}.`,
        discount: 0,
      };
    }

    setAppliedOffer(offer);
    const disc =
      offer.discountType === 'flat'
        ? offer.discountValue
        : Math.round((cartSubtotal * offer.discountValue) / 100);

    return {
      success: true,
      message: `Coupon ${offer.code} applied successfully! You saved ₹${disc}.`,
      discount: disc,
    };
  };

  const removeOffer = () => {
    setAppliedOffer(null);
  };

  // Automated Email Service
  const sendEmailForEvent = async (
    order: Order,
    eventType: EmailOutboxItem['eventType']
  ): Promise<EmailOutboxItem> => {
    const { subject, html } = generateEmailHtml(order, eventType);
    const newEmail: EmailOutboxItem = {
      id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      recipientEmail: order.customerEmail,
      recipientName: order.customerName,
      eventType,
      subject,
      htmlContent: html,
      status: 'sent', // Simulating successful delivery via verified transactional service
      attemptCount: 1,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setEmailOutbox((prev) => [newEmail, ...prev]);
    return newEmail;
  };

  const retryEmail = async (emailId: string): Promise<boolean> => {
    setEmailOutbox((prev) =>
      prev.map((mail) => {
        if (mail.id === emailId) {
          return {
            ...mail,
            status: 'sent',
            attemptCount: mail.attemptCount + 1,
            sentAt: new Date().toISOString(),
            error: undefined,
          };
        }
        return mail;
      })
    );
    return true;
  };

  // Order creation
  const createOrder = async (
    orderPayload: Omit<Order, 'id' | 'orderNumber' | 'secureAccessToken' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<Order> => {
    const now = new Date().toISOString();
    const randomOrderSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SGM-${new Date().getFullYear()}-${randomOrderSuffix}`;
    const secureAccessToken = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const newOrder: Order = {
      ...orderPayload,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      secureAccessToken,
      orderStatus: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: now,
          note: 'Order successfully created and accepted into system.',
        },
      ],
      createdAt: now,
      updatedAt: now,
      estimatedFulfillmentTime:
        orderPayload.fulfillmentType === 'pickup'
          ? 'Ready for pickup in 45-60 mins'
          : 'Estimated delivery within 2-3 hours',
    };

    // Concurrency safe stock reduction
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const purchasedItem = newOrder.items.find((item) => item.productId === prod.id);
        if (purchasedItem) {
          const currentBranchStock = prod.branchInventory[newOrder.branchId] ?? 0;
          const updatedStock = Math.max(0, currentBranchStock - purchasedItem.quantity);
          const updatedInv = { ...prod.branchInventory, [newOrder.branchId]: updatedStock };
          return {
            ...prod,
            branchInventory: updatedInv,
            inStock: Object.values(updatedInv).some((cnt) => cnt > 0),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Send Event 1: Order received email
    await sendEmailForEvent(newOrder, 'order_received');

    // If already verified via Razorpay online payment, send Event 2: Payment confirmed
    if (newOrder.paymentStatus === 'verified') {
      await sendEmailForEvent(newOrder, 'payment_confirmed');
    }

    // Clear cart after checkout
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): Promise<boolean> => {
    const now = new Date().toISOString();
    let targetOrder: Order | undefined;

    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          const updatedOrder: Order = {
            ...ord,
            orderStatus: newStatus,
            updatedAt: now,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: newStatus,
                timestamp: now,
                note: note || `Order marked as ${newStatus.replace('_', ' ')}`,
                updatedBy: staffUser?.name || 'Authorized Store Staff',
              },
            ],
          };
          targetOrder = updatedOrder;
          return updatedOrder;
        }
        return ord;
      })
    );

    if (targetOrder) {
      // Trigger corresponding transactional email event
      let eventType: EmailOutboxItem['eventType'] | null = null;
      if (newStatus === 'confirmed') eventType = 'order_confirmed';
      else if (newStatus === 'packed') eventType = 'order_packed';
      else if (newStatus === 'out_for_delivery') eventType = 'out_for_delivery';
      else if (newStatus === 'delivered') eventType = 'order_completed';
      else if (newStatus === 'cancelled') eventType = 'order_cancelled';

      if (eventType) {
        await sendEmailForEvent(targetOrder, eventType);
      }
      return true;
    }

    return false;
  };

  const getOrderById = (orderIdOrNumber: string): Order | undefined => {
    return orders.find(
      (o) =>
        o.id === orderIdOrNumber ||
        o.orderNumber.toLowerCase() === orderIdOrNumber.toLowerCase() ||
        o.orderNumber.replace(/[^0-9]/g, '') === orderIdOrNumber.replace(/[^0-9]/g, '')
    );
  };

  // Customer profile actions
  const customerLogin = (name: string, email: string, phone: string) => {
    setCustomer((prev) => ({
      id: prev?.id || `cust_${Date.now()}`,
      name,
      email,
      phone,
      savedAddresses: prev?.savedAddresses || [],
      wishlist: prev?.wishlist || [],
      createdAt: prev?.createdAt || new Date().toISOString(),
    }));
  };

  const customerLogout = () => {
    setCustomer(null);
  };

  const updateCustomerAddress = (address: CustomerUser['savedAddresses'][0]) => {
    if (!customer) return;
    setCustomer((prev) => {
      if (!prev) return null;
      const existingIndex = prev.savedAddresses.findIndex((a) => a.id === address.id);
      let updatedAddresses = [...prev.savedAddresses];
      if (existingIndex >= 0) {
        updatedAddresses[existingIndex] = address;
      } else {
        updatedAddresses.push(address);
      }
      return { ...prev, savedAddresses: updatedAddresses };
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (customer) {
        setCustomer({ ...customer, wishlist: next });
      }
      return next;
    });
  };

  // Staff Authentication & Role management
  const staffLogin = (email: string, requestedRole?: StaffUser['role']): boolean => {
    const user = staffList.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (user && user.isActive) {
      const activeUser = {
        ...user,
        role: requestedRole || user.role,
        lastLogin: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setStaffUser(activeUser);
      return true;
    }
    // Preset demo fallback
    if (email === 'owner@sargammart.com') {
      const owner = INITIAL_STAFF_USERS[0];
      setStaffUser(owner);
      return true;
    }
    return false;
  };

  const staffLogout = () => {
    setStaffUser(null);
  };

  const updateStaffUser = (updated: StaffUser) => {
    setStaffList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (staffUser?.id === updated.id) {
      setStaffUser(updated);
    }
  };

  const addStaffUser = (newUser: StaffUser) => {
    setStaffList((prev) => [...prev, newUser]);
  };

  return (
    <StoreContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        updateBranch,
        isBranchModalOpen,
        setIsBranchModalOpen,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        updateBranchStock,
        offers,
        appliedOffer,
        applyOfferCode,
        removeOffer,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartMrpTotal,
        cartSavings,
        deliveryFee,
        orderDiscount,
        cartGrandTotal,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        customer,
        customerLogin,
        customerLogout,
        updateCustomerAddress,
        wishlist,
        toggleWishlist,
        staffUser,
        staffLogin,
        staffLogout,
        staffList,
        updateStaffUser,
        addStaffUser,
        emailOutbox,
        retryEmail,
        sendEmailForEvent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
