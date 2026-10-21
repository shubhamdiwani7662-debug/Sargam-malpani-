import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Check, 
  Tag, 
  AlertCircle, 
  Eye, 
  Heart,
  X,
  MapPin,
  Barcode
} from 'lucide-react';

interface ShopViewProps {
  initialCategoryId?: string;
  navigate: (route: string, param?: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ initialCategoryId, navigate }) => {
  const { 
    products, 
    categories, 
    selectedBranch, 
    setIsBranchModalOpen, 
    cart, 
    addToCart, 
    updateCartQuantity,
    wishlist,
    toggleWishlist
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'name' | 'newest'>('relevance');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Product Detail Modal state
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Available brands derived from products
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set).sort();
  }, [products]);

  // Available subcategories for current category
  const subcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat ? cat.subcategories : [];
  }, [selectedCategory, categories]);

  // Filter & Search Logic (Conventional indexing, zero AI credit usage!)
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const branchId = selectedBranch?.id || 'branch-1';

    return products
      .filter((p) => {
        // Search matching: name, brand, category, SKU, barcode, features
        if (query) {
          const matchName = p.name.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchSku = p.sku.toLowerCase().includes(query);
          const matchBarcode = p.barcode.includes(query);
          const matchSub = p.subcategory.toLowerCase().includes(query);
          const matchFeatures = p.features.some((f) => f.toLowerCase().includes(query));

          if (!matchName && !matchBrand && !matchSku && !matchBarcode && !matchSub && !matchFeatures) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Branch stock filter
        const stockAtBranch = p.branchInventory[branchId] ?? 0;
        if (onlyInStock && stockAtBranch <= 0) {
          return false;
        }

        // Active offers filter
        if (onlyOffers && !p.offerPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.offerPrice ?? a.sellingPrice;
        const priceB = b.offerPrice ?? b.sellingPrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        // Relevance default
        return b.rating - a.rating;
      });
  }, [
    products, 
    searchQuery, 
    selectedCategory, 
    selectedSubcategory, 
    selectedBrand, 
    onlyInStock, 
    onlyOffers, 
    sortBy, 
    selectedBranch
  ]);

  const currentBranchId = selectedBranch?.id || 'branch-1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Search & Store Notification Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Top bar with store badge & search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6D6661]">Store Location:</span>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-[#C92520] font-bold text-xs rounded-lg transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedBranch?.name || 'Select Branch'}</span>
              <span className="text-[11px] underline">Change</span>
            </button>
          </div>

          <div className="text-xs text-[#23734B] font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Showing Live Inventory & Local Prices</span>
          </div>
        </div>

        {/* Amazon-Style Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 10,000+ items by product name, brand (Aashirvaad, Amul, Tata), barcode, or category..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#FFF9F4] rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520] focus:bg-white text-sm text-[#272321] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Pills for Quick Switching */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#C92520] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#C92520] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#272321] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C92520]" />
              <span>Filters</span>
            </h3>
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || onlyInStock || onlyOffers) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSelectedBrand('all');
                  setOnlyInStock(false);
                  setOnlyOffers(false);
                }}
                className="text-xs text-[#C92520] font-semibold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Subcategories (if a category is active) */}
          {subcategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#641E24] uppercase tracking-wider">Subcategory</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`block w-full text-left text-xs py-1 px-2 rounded ${
                    selectedSubcategory === 'all' ? 'bg-red-50 text-[#C92520] font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Subcategories
                </button>
                {subcategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`block w-full text-left text-xs py-1 px-2 rounded ${
                      selectedSubcategory === sub ? 'bg-red-50 text-[#C92520] font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brands Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#641E24] uppercase tracking-wider">Brand</h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#C92520] focus:ring-[#C92520]"
              />
              <span>In-Stock at Selected Store Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={(e) => setOnlyOffers(e.target.checked)}
                className="rounded text-[#C92520] focus:ring-[#C92520]"
              />
              <span>Discounted & Special Offers Only</span>
            </label>
          </div>

          {/* Branch Ordering Alert */}
          {selectedBranch && !selectedBranch.orderingEnabled && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              <AlertCircle className="w-4 h-4 mb-1" />
              Online ordering is temporarily paused for {selectedBranch.name}. Please select another branch or visit in person.
            </div>
          )}
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Sorting & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div className="text-slate-600 font-medium">
              Showing <strong>{filteredProducts.length}</strong> items in catalog
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-[#C92520]"
              >
                <option value="relevance">Popularity / Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="newest">Newest Arrivals</option>
              </select>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 text-slate-700 bg-slate-100 rounded-lg font-bold flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#272321]">No Products Found</h3>
              <p className="text-xs text-[#6D6661] max-w-sm mx-auto">
                We couldn't find items matching your search or filters. Try clearing your search query or switching branch.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSelectedBrand('all');
                  setOnlyInStock(false);
                  setOnlyOffers(false);
                }}
                className="px-4 py-2 bg-[#C92520] text-white text-xs font-bold rounded-lg hover:bg-[#B01E1A]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const stockAtBranch = product.branchInventory[currentBranchId] ?? 0;
                const isOutOfStock = stockAtBranch <= 0;
                const price = product.offerPrice ?? product.sellingPrice;
                const discount = product.mrp - price;
                const cartItem = cart.find((item) => item.productId === product.id);
                const isWishlisted = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all relative group"
                  >
                    {/* Top Row: Brand, Dietary, Wishlist */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-[#641E24] uppercase tracking-wider">
                          {product.brand}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Vegetarian Dot Indicator */}
                          <span 
                            title={product.dietary === 'veg' ? '100% Vegetarian' : 'General Grocery'}
                            className={`w-3.5 h-3.5 border flex items-center justify-center ${
                              product.dietary === 'veg' ? 'border-emerald-600' : 'border-slate-400'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              product.dietary === 'veg' ? 'bg-emerald-600' : 'bg-slate-500'
                            }`} />
                          </span>

                          {/* Wishlist toggle */}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="p-1 text-slate-300 hover:text-[#C92520] transition-colors"
                            title="Save to Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C92520] text-[#C92520]' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Product Name & Pack Size */}
                      <h3
                        onClick={() => setActiveProductModal(product)}
                        className="font-bold text-base text-[#272321] line-clamp-2 hover:text-[#C92520] cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <div className="text-xs text-slate-500 font-medium mt-1">
                        Pack Size: <span className="text-slate-800 font-semibold">{product.packSize}</span>
                      </div>

                      {/* Offer badge if present */}
                      {product.offerLabel && (
                        <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-[#23734B] bg-emerald-50 px-2 py-0.5 rounded">
                          <Tag className="w-3 h-3" />
                          <span>{product.offerLabel}</span>
                        </div>
                      )}

                      {/* Stock Status for selected branch */}
                      <div className="mt-3 text-[11px]">
                        {isOutOfStock ? (
                          <span className="text-red-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Out of stock at {selectedBranch?.code || 'store'}
                          </span>
                        ) : stockAtBranch < 15 ? (
                          <span className="text-amber-700 font-semibold">
                            Only {stockAtBranch} left in stock
                          </span>
                        ) : (
                          <span className="text-[#23734B] font-semibold">
                            In Stock ({stockAtBranch} units available)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Add to Cart Controls */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-extrabold text-[#272321] tabular-nums">
                          ₹{price}
                        </span>
                        {product.mrp > price && (
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            MRP ₹{product.mrp}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-xs font-bold text-[#23734B]">
                            Save ₹{discount}
                          </span>
                        )}
                      </div>

                      {cartItem ? (
                        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                          <button
                            onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:text-[#C92520] hover:bg-slate-50 shadow-xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold text-[#272321] tabular-nums px-2">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                            disabled={cartItem.quantity >= stockAtBranch}
                            className="w-8 h-8 rounded-lg bg-[#C92520] flex items-center justify-center text-white hover:bg-[#B01E1A] shadow-xs disabled:bg-slate-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isOutOfStock}
                          className="w-full py-2.5 bg-[#C92520] hover:bg-[#B01E1A] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
                        </button>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <button
                          onClick={() => setActiveProductModal(product)}
                          className="hover:text-[#641E24] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Product Details</span>
                        </button>
                        <span className="font-mono text-[10px]">SKU: {product.sku}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveProductModal(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#C92520] uppercase tracking-wider">
                {activeProductModal.brand} · {activeProductModal.subcategory}
              </span>
              <h2 className="text-xl font-bold text-[#272321]">
                {activeProductModal.name}
              </h2>
              <div className="text-xs text-slate-500">
                Pack Size: <strong>{activeProductModal.packSize}</strong>
              </div>
            </div>

            <div className="flex items-baseline gap-3 py-2 border-y border-slate-100">
              <span className="text-2xl font-extrabold text-[#272321] tabular-nums">
                ₹{activeProductModal.offerPrice ?? activeProductModal.sellingPrice}
              </span>
              {activeProductModal.mrp > (activeProductModal.offerPrice ?? activeProductModal.sellingPrice) && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  MRP ₹{activeProductModal.mrp}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6D6661] leading-relaxed">
              {activeProductModal.description}
            </p>

            {/* Key product features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#641E24] uppercase tracking-wider">Product Highlights</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeProductModal.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#23734B]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Barcode & SKU */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-slate-500" />
                <span>Barcode: <strong className="font-mono">{activeProductModal.barcode}</strong></span>
              </div>
              <span>SKU: <strong className="font-mono">{activeProductModal.sku}</strong></span>
            </div>

            <button
              onClick={() => {
                addToCart(activeProductModal);
                setActiveProductModal(null);
              }}
              className="w-full py-3 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Add to Basket
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
