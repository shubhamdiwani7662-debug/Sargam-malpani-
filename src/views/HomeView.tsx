import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Tag,
  PhoneCall
} from 'lucide-react';

interface HomeViewProps {
  navigate: (route: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { categories, products, branches, setIsBranchModalOpen, addToCart } = useStore();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION: Supermarket Photography & Value Proposition */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F4] to-[#F1E8E0]/40 pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C92520] bg-red-100/60 px-3 py-1 rounded-md">
                <span>Malpani Group Supermarket Network</span>
                <span>·</span>
                <span>Sangamner</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#272321] tracking-tight leading-[1.15] text-balance">
                Everything Your Family Needs. <br className="hidden sm:inline" />
                <span className="text-[#C92520]">All in One Place.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6D6661] max-w-2xl leading-relaxed">
                Welcome to <strong>Malpani Sargam Super Mart</strong>, the trusted supermarket destination for families across Sangamner and Ahmednagar district. Experience spotless aisles, transparent daily savings, and verified fresh groceries delivered straight to your doorstep or ready for store pickup.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('shop')}
                  className="px-6 py-3.5 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Online Catalog</span>
                </button>

                <button
                  onClick={() => navigate('stores')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#272321] font-bold text-sm sm:text-base rounded-xl border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-[#EF8018]" />
                  <span>Explore Our Stores</span>
                </button>
              </div>

              {/* Trust Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl font-extrabold text-[#641E24] tabular-nums">10,000+</div>
                  <div className="text-xs text-[#6D6661] font-medium mt-0.5">Verified Products</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#641E24] tabular-nums">3 Branches</div>
                  <div className="text-xs text-[#6D6661] font-medium mt-0.5">Across Sangamner</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#641E24] tabular-nums">Since 1894</div>
                  <div className="text-xs text-[#6D6661] font-medium mt-0.5">Malpani Group Legacy</div>
                </div>
              </div>
            </div>

            {/* Right Supermarket Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2">
                {/* Visual Banner */}
                <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#641E24] to-[#C92520] p-6 flex flex-col justify-between text-white">
                  <div className="space-y-2">
                    <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded">
                      In-Store & Online
                    </span>
                    <h3 className="text-2xl font-bold leading-snug">
                      Fresh Groceries, Household Essentials & Daily Savings
                    </h3>
                  </div>

                  <div className="bg-white/95 text-[#272321] rounded-lg p-3.5 backdrop-blur-xs shadow-lg space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#641E24]">
                      <span>Daily Grocery Rationing</span>
                      <span className="text-[#23734B] font-bold">Up to 25% OFF</span>
                    </div>
                    <p className="text-[11px] text-[#6D6661]">
                      Atta, Basmati Rice, Desi Cow Ghee, Pulses & Premium Dry Fruits at honest wholesale-inspired prices.
                    </p>
                  </div>
                </div>

                {/* Quick Store Info Bar */}
                <div className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#C92520] shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#272321]">Fast Local Delivery</div>
                      <div className="text-slate-500">Free over ₹499</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBranchModalOpen(true)}
                    className="text-[#C92520] font-bold hover:underline"
                  >
                    Select Store →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight">
              Explore Our Supermarket Departments
            </h2>
            <p className="text-sm text-[#6D6661] mt-1">
              Carefully organized aisles with genuine brands, unadulterated staples, and daily essentials.
            </p>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs sm:text-sm font-bold text-[#C92520] hover:text-[#B01E1A] flex items-center gap-1.5 shrink-0"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('shop', cat.id)}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#EF8018] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFF9F4] border border-slate-100 flex items-center justify-center text-[#C92520] group-hover:bg-[#C92520] group-hover:text-white transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#272321] mt-4 group-hover:text-[#C92520] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6D6661] mt-1.5 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#6D6661]">
                <span>{cat.itemCount} Items</span>
                <span className="font-semibold text-[#C92520] group-hover:translate-x-0.5 transition-transform">
                  Shop Now →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & VALUE DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#23734B] uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>Verified Supermarket Value</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight mt-1">
              Top Family Essentials & Savings
            </h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs sm:text-sm font-bold text-[#C92520] hover:text-[#B01E1A] flex items-center gap-1.5 shrink-0"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const price = product.offerPrice ?? product.sellingPrice;
            const savings = product.mrp - price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6D6661] mb-2">
                    <span className="font-bold text-[#641E24] uppercase tracking-wider">{product.brand}</span>
                    <span className="font-medium text-slate-500">{product.packSize}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#272321] line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#6D6661] mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.features.slice(0, 2).map((feat, i) => (
                      <span key={i} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

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
                    {savings > 0 && (
                      <span className="text-xs font-bold text-[#23734B]">
                        Save ₹{savings}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="w-full py-2.5 bg-[#C92520] hover:bg-[#B01E1A] text-white text-xs font-bold rounded-lg shadow-xs hover:shadow transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. BUSINESS ADVANTAGES: Verified Facts */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight">
              Why Families Rely on Sargam Super Mart
            </h2>
            <p className="text-sm text-[#6D6661] mt-2">
              Backed by the heritage of the Malpani Group, our supermarket network delivers the highest standards of purity, fair pricing, and neighborhood convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#FFF9F4] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#C92520]/10 flex items-center justify-center text-[#C92520] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#272321]">Zero Compromise on Purity</h3>
              <p className="text-xs text-[#6D6661] mt-2 leading-relaxed">
                Every grain, pulse, edible oil, and dairy product undergoes quality screening. We stock verified manufacturer batches with transparent manufacturing and expiry dates.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FFF9F4] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#EF8018]/10 flex items-center justify-center text-[#EF8018] mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#272321]">Speed & Convenience</h3>
              <p className="text-xs text-[#6D6661] mt-2 leading-relaxed">
                Enjoy hassle-free home delivery across Sangamner or choose express store pickup. Your grocery basket is picked by trained personnel who care for pack integrity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FFF9F4] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#23734B]/10 flex items-center justify-center text-[#23734B] mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#272321]">Honest Wholesale-Style Savings</h3>
              <p className="text-xs text-[#6D6661] mt-2 leading-relaxed">
                No false MRP markups or synthetic flash sales. Our daily supermarket prices reflect legitimate volume discounts passed directly to local households.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STORE LOCATIONS SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#272321] tracking-tight">
              Our Supermarket Branches
            </h2>
            <p className="text-sm text-[#6D6661] mt-1">
              Visit our air-conditioned shopping floors or place your order online for local delivery.
            </p>
          </div>
          <button
            onClick={() => navigate('stores')}
            className="text-xs sm:text-sm font-bold text-[#C92520] hover:text-[#B01E1A] flex items-center gap-1.5 shrink-0"
          >
            <span>Branch Details & Timings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-[#C92520] uppercase tracking-wider">{b.code}</span>
                  <span className="text-xs font-semibold text-[#23734B] bg-emerald-50 px-2 py-0.5 rounded">Open Daily</span>
                </div>

                <h3 className="font-bold text-base text-[#272321]">{b.name}</h3>
                <p className="text-xs text-[#6D6661] mt-2 leading-relaxed">
                  {b.address}, {b.landmark}, {b.city} – {b.pincode}
                </p>

                <div className="space-y-1 mt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.timings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsBranchModalOpen(true);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-[#C92520] bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center"
                >
                  Shop This Store
                </button>
                <button
                  onClick={() => navigate('stores')}
                  className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
                >
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#641E24] rounded-2xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center lg:text-left">
            <span className="bg-[#EF8018] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Special Welcome Voucher
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get ₹50 OFF On Your First Grocery Order
            </h2>
            <p className="text-sm text-slate-200 max-w-xl">
              Use promo code <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">SARGAM50</strong> at checkout on orders above ₹499. Valid across all 3 branches.
            </p>
          </div>

          <button
            onClick={() => navigate('shop')}
            className="px-8 py-4 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            Start Shopping Now →
          </button>
        </div>
      </section>

    </div>
  );
};
