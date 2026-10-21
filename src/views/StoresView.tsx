import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, Truck, ShoppingBag, ExternalLink } from 'lucide-react';

interface StoresViewProps {
  navigate: (route: string) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({ navigate }) => {
  const { branches, selectedBranch, setSelectedBranch } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C92520] bg-red-50 px-3 py-1 rounded">
          <span>Retail Locations</span>
          <span>·</span>
          <span>Sangamner Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#272321] tracking-tight">
          Find Your Nearest Sargam Super Mart
        </h1>
        <p className="text-sm text-[#6D6661]">
          Visit any of our convenient locations for a pleasant in-store shopping experience, or select your branch to begin online grocery ordering.
        </p>
      </div>

      {/* Stores List */}
      <div className="space-y-6">
        {branches.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;

          return (
            <div
              key={branch.id}
              className={`bg-white rounded-2xl border-2 p-6 sm:p-8 transition-all ${
                isSelected ? 'border-[#C92520] shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Branch Info */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-white bg-[#641E24] px-2.5 py-1 rounded">
                      {branch.code}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#272321]">
                      {branch.name}
                    </h2>
                    {isSelected && (
                      <span className="text-xs font-bold text-[#C92520] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                        Currently Selected Store
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-[#6D6661]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C92520] shrink-0 mt-0.5" />
                      <span>{branch.address}, {branch.landmark}, {branch.city}, {branch.district}, {branch.state} – {branch.pincode}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span><strong>Store Operating Hours:</strong> {branch.timings}</span>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#23734B] shrink-0" />
                        <span><strong>Phone:</strong> {branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#EF8018] shrink-0" />
                        <span><strong>Email:</strong> {branch.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service capabilities */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Truck className="w-4 h-4 text-[#23734B]" />
                      <span>
                        {branch.deliveryEnabled
                          ? `Home Delivery Enabled (Fee ₹${branch.deliveryFee} · Free above ₹${branch.freeDeliveryThreshold})`
                          : 'Delivery Currently Suspended'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <ShoppingBag className="w-4 h-4 text-[#EF8018]" />
                      <span>Store Self-Pickup: Available in 45 Mins</span>
                    </div>
                  </div>

                  {/* Delivery Areas */}
                  <div className="pt-2 text-xs text-[#6D6661]">
                    <strong>Local Delivery Areas:</strong> {branch.serviceAreas.join(', ')}
                  </div>

                  {branch.pauseNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <strong>Branch Notice:</strong> {branch.pauseNotice}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end h-full">
                  <button
                    onClick={() => {
                      setSelectedBranch(branch);
                      navigate('shop');
                    }}
                    className="w-full py-3 px-4 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all text-center"
                  >
                    Select & Shop From This Store
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.address} Sangamner`)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    <span>Get Driving Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
