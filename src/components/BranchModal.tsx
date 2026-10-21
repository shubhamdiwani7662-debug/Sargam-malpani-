import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Clock, Truck, ShoppingBag, Check, AlertCircle, X } from 'lucide-react';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuccess?: () => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({ isOpen, onClose, onSelectSuccess }) => {
  const { branches, selectedBranch, setSelectedBranch } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FFF9F4]">
          <div>
            <h3 id="branch-modal-title" className="text-lg font-bold text-[#641E24]">
              Select Your Nearest Sargam Super Mart Branch
            </h3>
            <p className="text-xs text-[#6D6661] mt-0.5">
              Prices, product availability, and delivery services are tailored to your chosen store location.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close branch selector"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Cards */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {branches.map((branch) => {
            const isSelected = selectedBranch?.id === branch.id;
            const canOrder = branch.orderingEnabled && branch.isOpen;

            return (
              <div
                key={branch.id}
                onClick={() => {
                  if (canOrder) {
                    setSelectedBranch(branch);
                    onClose();
                    if (onSelectSuccess) onSelectSuccess();
                  }
                }}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C92520] bg-[#FFF9F4] shadow-sm'
                    : canOrder
                    ? 'border-slate-200 hover:border-[#EF8018] bg-white hover:shadow-xs'
                    : 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#272321]">{branch.name}</h4>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C92520] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5 mt-2 text-xs text-[#6D6661]">
                      <MapPin className="w-3.5 h-3.5 text-[#C92520] shrink-0 mt-0.5" />
                      <span>{branch.address}, {branch.landmark}, {branch.city} – {branch.pincode}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6D6661]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Timings: {branch.timings}</span>
                    </div>

                    {/* Service Capabilities */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Truck className="w-3.5 h-3.5 text-[#23734B]" />
                        <span>
                          {branch.deliveryEnabled
                            ? `Home Delivery (₹${branch.deliveryFee} · Free above ₹${branch.freeDeliveryThreshold})`
                            : 'Pickup Only'}
                        </span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#EF8018]" />
                        <span>Min Order: ₹{branch.minOrderAmount}</span>
                      </div>
                    </div>

                    {branch.pauseNotice && (
                      <div className="flex items-center gap-1.5 mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{branch.pauseNotice}</span>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!canOrder}
                    className={`shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#C92520] text-white shadow-xs'
                        : canOrder
                        ? 'bg-slate-100 text-slate-800 hover:bg-[#C92520] hover:text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSelected ? 'Current Store' : canOrder ? 'Select Store' : 'Unavailable'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need help finding your branch? Call customer care at <strong>+91 2425 225 500</strong></span>
          <button 
            onClick={onClose}
            className="text-xs font-semibold text-[#641E24] hover:underline"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
