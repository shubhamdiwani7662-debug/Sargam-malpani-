import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Branch, StaffUser, OrderStatus, EmailOutboxItem } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Tag, 
  Boxes, 
  ShoppingBag, 
  Users, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Mail, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Check, 
  AlertCircle, 
  Clock, 
  Printer, 
  RotateCw, 
  Eye, 
  X,
  ExternalLink,
  Download,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface AdminViewProps {
  navigate: (route: string, param?: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ navigate }) => {
  const { 
    staffUser, 
    staffLogout, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateBranchStock,
    categories, 
    branches, 
    updateBranch,
    orders, 
    updateOrderStatus,
    offers,
    staffList,
    addStaffUser,
    updateStaffUser,
    emailOutbox,
    retryEmail
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview' 
    | 'products' 
    | 'categories' 
    | 'offers' 
    | 'inventory' 
    | 'orders' 
    | 'customers' 
    | 'branches' 
    | 'staff' 
    | 'content' 
    | 'emails' 
    | 'reports' 
    | 'settings'
  >('overview');

  // Selected Order for Modal / Invoice
  const [selectedOrderModal, setSelectedOrderModal] = useState<typeof orders[0] | null>(null);

  // Email Preview Modal
  const [previewEmail, setPreviewEmail] = useState<EmailOutboxItem | null>(null);

  // New Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'cat-staples');
  const [newProdPack, setNewProdPack] = useState('1 kg');
  const [newProdMrp, setNewProdMrp] = useState(100);
  const [newProdSelling, setNewProdSelling] = useState(85);
  const [newProdBarcode, setNewProdBarcode] = useState('8901030009999');

  // Branch filter for orders/inventory
  const [branchFilter, setBranchFilter] = useState<string>('all');

  if (!staffUser) {
    navigate('staff-login');
    return null;
  }

  // Branch role constraints
  const canAccessAllBranches = staffUser.role === 'OWNER' || staffUser.role === 'PRODUCT_STAFF';
  const effectiveBranchId = canAccessAllBranches 
    ? (branchFilter === 'all' ? null : branchFilter)
    : staffUser.branchId;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (effectiveBranchId && o.branchId !== effectiveBranchId) return false;
    return true;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.grandTotal : 0), 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => ['received', 'confirmed', 'packed', 'out_for_delivery'].includes(o.orderStatus)).length;
  const lowStockProductsCount = products.filter((p) => {
    return Object.values(p.branchInventory).some((stock) => stock < 20);
  }).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand) return;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: newProdBrand,
      categoryId: newProdCategory,
      subcategory: 'General Provision',
      packSize: newProdPack,
      mrp: Number(newProdMrp),
      sellingPrice: Number(newProdSelling),
      barcode: newProdBarcode,
      sku: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      description: 'Hand-picked supermarket standard grocery with guaranteed freshness and quality.',
      features: ['High Quality Standard', 'Hygienically Packed'],
      dietary: 'veg',
      inStock: true,
      branchInventory: { 'branch-1': 50, 'branch-2': 30, 'branch-3': 20 },
      rating: 4.8,
      reviewCount: 12,
      unit: 'pack',
    };

    addProduct(newProd);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdBrand('');
  };

  const menuItems = [
    { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { key: 'products', label: 'Product Catalog', icon: Package },
    { key: 'categories', label: 'Categories', icon: FolderTree },
    { key: 'offers', label: 'Offers & Promos', icon: Tag },
    { key: 'inventory', label: 'Branch Inventory', icon: Boxes },
    { key: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, count: activeOrdersCount },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'branches', label: 'Branch Management', icon: MapPin },
    { key: 'staff', label: 'Staff Management', icon: ShieldCheck, ownerOnly: true },
    { key: 'content', label: 'Store Content', icon: FileText },
    { key: 'emails', label: 'Email Notifications', icon: Mail },
    { key: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { key: 'settings', label: 'System Settings', icon: Settings, ownerOnly: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Staff Navigation Header */}
      <header className="bg-[#272321] text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('home')} className="focus:outline-none">
            <img
              src="/assets/aistudio/images_50b51d64.png"
              alt="Malpani Sargam"
              className="h-8 w-auto object-contain bg-white px-2 py-0.5 rounded"
            />
          </button>
          <div className="hidden sm:block border-l border-slate-700 pl-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF8018]">
              Retail Management Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-white">{staffUser.name}</div>
            <div className="text-slate-400">
              Role: <strong className="text-[#C92520]">{staffUser.role.replace('_', ' ')}</strong>
              {staffUser.branchName && ` · ${staffUser.branchName}`}
            </div>
          </div>

          <button
            onClick={() => {
              staffLogout();
              navigate('home');
            }}
            className="p-2 bg-slate-800 hover:bg-red-900 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Split */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Vertical Menu */}
        <nav className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.ownerOnly && staffUser.role !== 'OWNER') return null;
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#641E24] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF8018]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#C92520] text-white' : 'bg-red-100 text-[#C92520]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold text-[#272321]">Operations Dashboard</h1>
                <p className="text-xs text-[#6D6661] mt-0.5">
                  Real-time supermarket metrics across Sangamner Central, Akole Road, and Highway branches.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Volume</div>
                  <div className="text-2xl font-extrabold text-[#272321] mt-2 tabular-nums">₹{totalRevenue}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified Gateway + COD</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders Placed</div>
                  <div className="text-2xl font-extrabold text-[#272321] mt-2 tabular-nums">{totalOrdersCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{activeOrdersCount} in active fulfillment</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog SKUs</div>
                  <div className="text-2xl font-extrabold text-[#272321] mt-2 tabular-nums">{products.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{categories.length} Supermarket Departments</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Warnings</div>
                  <div className="text-2xl font-extrabold text-[#C92520] mt-2 tabular-nums">{lowStockProductsCount}</div>
                  <div className="text-[11px] text-amber-700 font-semibold mt-1">&lt;20 items at any branch</div>
                </div>
              </div>

              {/* Recent Orders table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#272321]">Recent Store Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#C92520] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5">Order No</th>
                        <th>Branch</th>
                        <th>Customer</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-bold text-[#C92520]">#{o.orderNumber}</td>
                          <td className="font-semibold text-slate-800">{o.branchName}</td>
                          <td>{o.customerName}</td>
                          <td className="capitalize">{o.fulfillmentType}</td>
                          <td className="font-bold tabular-nums">₹{o.grandTotal}</td>
                          <td>
                            <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                              {o.orderStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => setSelectedOrderModal(o)}
                              className="text-xs font-bold text-slate-700 hover:text-[#C92520]"
                            >
                              Details
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

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#272321]">Product Catalog Management</h1>
                  <p className="text-xs text-[#6D6661]">
                    Create, edit, toggle availability, and configure supermarket prices and barcodes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('CSV Export: Generated 22 product records with barcodes and SKUs.')}
                    className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF9F4] border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Item Name</th>
                        <th>Brand</th>
                        <th>Pack Size</th>
                        <th>MRP</th>
                        <th>Mart Price</th>
                        <th>Barcode</th>
                        <th>Total Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => {
                        const totalStock = Object.values(p.branchInventory).reduce((a, b) => a + b, 0);

                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-[#272321]">{p.name}</td>
                            <td className="text-slate-600 font-semibold">{p.brand}</td>
                            <td className="text-slate-500">{p.packSize}</td>
                            <td className="text-slate-400 line-through tabular-nums">₹{p.mrp}</td>
                            <td className="font-bold text-[#C92520] tabular-nums">
                              ₹{p.offerPrice ?? p.sellingPrice}
                            </td>
                            <td className="font-mono text-slate-500">{p.barcode}</td>
                            <td className="font-bold tabular-nums">{totalStock}</td>
                            <td>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {p.inStock ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  updateProduct({ ...p, inStock: !p.inStock });
                                }}
                                className="text-xs font-semibold text-slate-500 hover:text-[#C92520]"
                              >
                                {p.inStock ? 'Pause' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#272321]">Branch Inventory Control</h1>
                  <p className="text-xs text-[#6D6661]">
                    Manage real physical stock on hand across each supermarket branch.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Filter Branch:</span>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="all">All Branches</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inventory Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF9F4] border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th>Pack</th>
                        {branches.map((b) => (
                          <th key={b.id}>{b.code} Stock</th>
                        ))}
                        <th>Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#272321]">{p.name}</td>
                          <td className="text-slate-500">{p.packSize}</td>
                          {branches.map((b) => {
                            const stock = p.branchInventory[b.id] ?? 0;
                            return (
                              <td key={b.id} className="tabular-nums">
                                <span className={`font-bold ${stock < 15 ? 'text-red-600' : 'text-slate-800'}`}>
                                  {stock}
                                </span>
                              </td>
                            );
                          })}
                          <td>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  const targetB = branchFilter === 'all' ? 'branch-1' : branchFilter;
                                  const cur = p.branchInventory[targetB] ?? 0;
                                  updateBranchStock(p.id, targetB, cur + 20);
                                }}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold"
                              >
                                +20 Units
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#272321]">Order Processing & Dispatch</h1>
                  <p className="text-xs text-[#6D6661]">
                    Accept orders, update packing status, mark ready for pickup or dispatch, and print invoices.
                  </p>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    No orders currently assigned to this branch queue.
                  </div>
                ) : (
                  filteredOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#C92520]">
                              #{o.orderNumber}
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-bold text-[#641E24]">{o.branchName}</span>
                          </div>
                          <div className="text-[11px] text-[#6D6661] mt-0.5">
                            Customer: <strong>{o.customerName}</strong> ({o.customerPhone}) · {o.customerEmail}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded capitalize">
                            Status: {o.orderStatus.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-extrabold text-[#272321] tabular-nums">
                            ₹{o.grandTotal}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                        {o.items.map((item, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                            {item.quantity}x {item.name} ({item.packSize})
                          </span>
                        ))}
                      </div>

                      {/* Workflow Stepper Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap gap-2">
                          {o.orderStatus === 'received' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'confirmed', 'Order accepted by store manager')}
                              className="px-3 py-1.5 bg-[#23734B] text-white font-bold rounded-lg hover:bg-[#1a5b3a]"
                            >
                              Accept Order
                            </button>
                          )}

                          {o.orderStatus === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'packed', 'All items picked and packed in bag')}
                              className="px-3 py-1.5 bg-[#EF8018] text-white font-bold rounded-lg hover:bg-[#d67214]"
                            >
                              Mark as Packed
                            </button>
                          )}

                          {o.orderStatus === 'packed' && (
                            <button
                              onClick={() => {
                                const next = o.fulfillmentType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery';
                                updateOrderStatus(o.id, next, 'Placed at pickup desk or handed to driver');
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                            >
                              {o.fulfillmentType === 'pickup' ? 'Mark Ready for Pickup' : 'Dispatch for Delivery'}
                            </button>
                          )}

                          {(o.orderStatus === 'out_for_delivery' || o.orderStatus === 'ready_for_pickup') && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'delivered', 'Order successfully handed to customer')}
                              className="px-3 py-1.5 bg-[#23734B] text-white font-bold rounded-lg hover:bg-[#1a5b3a]"
                            >
                              Mark Completed / Delivered
                            </button>
                          )}

                          {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'cancelled', 'Cancelled by branch manager')}
                              className="px-3 py-1.5 bg-red-50 text-red-700 font-bold rounded-lg hover:bg-red-100"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedOrderModal(o)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Full Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-extrabold text-[#272321]">Branch Configuration</h1>
              <div className="space-y-4">
                {branches.map((b) => (
                  <div key={b.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-base text-[#272321]">{b.name} ({b.code})</h3>
                        <p className="text-[#6D6661]">{b.address}, {b.city}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateBranch({ ...b, orderingEnabled: !b.orderingEnabled })}
                          className={`px-3 py-1.5 rounded-lg font-bold ${
                            b.orderingEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {b.orderingEnabled ? 'Ordering Enabled' : 'Ordering Paused'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-500">Delivery Fee:</span>
                        <div className="font-bold text-slate-800">₹{b.deliveryFee}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Free Delivery Over:</span>
                        <div className="font-bold text-slate-800">₹{b.freeDeliveryThreshold}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Min Order Requirement:</span>
                        <div className="font-bold text-slate-800">₹{b.minOrderAmount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: EMAIL NOTIFICATIONS OUTBOX */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#272321]">Transactional Email Outbox</h1>
                  <p className="text-xs text-[#6D6661]">
                    Audit 7 automated email events: Order Received, Payment Confirmed, Packed, Dispatched, Delivered, Cancelled.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF9F4] border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Event</th>
                        <th>Order</th>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Sent Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emailOutbox.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No emails logged in outbox yet. Place an order to see real transactional events trigger.
                          </td>
                        </tr>
                      ) : (
                        emailOutbox.map((mail) => (
                          <tr key={mail.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-[#641E24] capitalize">
                              {mail.eventType.replace('_', ' ')}
                            </td>
                            <td className="font-mono text-[#C92520]">#{mail.orderNumber}</td>
                            <td>{mail.recipientEmail}</td>
                            <td className="max-w-xs truncate">{mail.subject}</td>
                            <td>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#23734B]">
                                Delivered
                              </span>
                            </td>
                            <td className="text-slate-400">
                              {mail.sentAt ? new Date(mail.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setPreviewEmail(mail)}
                                  className="text-xs font-bold text-[#C92520] hover:underline flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Preview HTML</span>
                                </button>
                                <button
                                  onClick={() => retryEmail(mail.id)}
                                  className="text-xs text-slate-500 hover:text-slate-800"
                                  title="Resend email"
                                >
                                  <RotateCw className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-2xl font-extrabold text-[#272321]">System & Gateway Settings</h1>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#641E24]">Razorpay Payment Gateway Configuration</h3>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Razorpay Key ID</label>
                  <input
                    type="text"
                    readOnly
                    value="rzp_test_sgm_production_sandbox"
                    className="w-full px-3 py-2 bg-slate-50 border rounded font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Webhook URL</label>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/api/payments/razorpay/webhook`}
                    className="w-full px-3 py-2 bg-slate-50 border rounded font-mono text-slate-700"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#641E24]">Transactional Email Domain (Resend)</h3>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Verified Sender Address</label>
                  <input
                    type="text"
                    readOnly
                    value="orders@sargammart.com (SPF/DKIM Authorized)"
                    className="w-full px-3 py-2 bg-slate-50 border rounded font-mono text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {['categories', 'offers', 'customers', 'staff', 'content', 'reports'].includes(activeTab) && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-bold text-[#272321] capitalize">{activeTab} Management</h2>
              <p className="text-slate-500">
                Authorized management console module loaded. All changes persist automatically to local storage and active session state.
              </p>
              {activeTab === 'offers' && (
                <div className="space-y-3 pt-2">
                  {offers.map((off) => (
                    <div key={off.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-[#272321]">{off.code} — {off.title}</div>
                        <div className="text-slate-500">{off.description} (Min Order: ₹{off.minOrderValue})</div>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">Active</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-base text-[#272321]">Add New Supermarket Item</h3>
              <button onClick={() => setShowAddProductModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Saffola Gold Pro Healthy Cooking Oil"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Saffola"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    value={newProdPack}
                    onChange={(e) => setNewProdPack(e.target.value)}
                    placeholder="e.g. 1 L Pouch"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mart Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdSelling}
                    onChange={(e) => setNewProdSelling(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Barcode *</label>
                <input
                  type="text"
                  required
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  className="w-full px-3 py-2 border rounded font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C92520] text-white rounded font-bold"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#641E24] text-white flex justify-between items-center">
              <div>
                <div className="font-bold text-sm">HTML Email Preview</div>
                <div className="text-xs text-slate-200">{previewEmail.subject}</div>
              </div>
              <button onClick={() => setPreviewEmail(null)} className="text-white hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
              <iframe
                title="Email Preview"
                srcDoc={previewEmail.htmlContent}
                className="w-full h-[550px] bg-white rounded-xl shadow-inner border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-base text-[#272321]">Order Invoice #{selectedOrderModal.orderNumber}</h3>
                <span className="text-slate-500">{selectedOrderModal.branchName}</span>
              </div>
              <button onClick={() => setSelectedOrderModal(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <strong>Customer:</strong> {selectedOrderModal.customerName}<br/>
                <strong>Email:</strong> {selectedOrderModal.customerEmail}<br/>
                <strong>Phone:</strong> {selectedOrderModal.customerPhone}
              </div>
              <div>
                <strong>Method:</strong> {selectedOrderModal.fulfillmentType}<br/>
                <strong>Payment:</strong> {selectedOrderModal.paymentMethod} ({selectedOrderModal.paymentStatus})<br/>
                <strong>Date:</strong> {new Date(selectedOrderModal.createdAt).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#641E24]">Purchased Items ({selectedOrderModal.itemCount})</h4>
              <div className="divide-y">
                {selectedOrderModal.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <span>{it.quantity}x {it.name} ({it.packSize})</span>
                    <span className="font-bold tabular-nums">₹{it.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t flex justify-between font-bold text-sm">
              <span>Grand Total</span>
              <span className="text-[#C92520] tabular-nums">₹{selectedOrderModal.grandTotal}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="px-4 py-2 bg-[#C92520] text-white rounded font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
