import React from 'react';
import { ShieldCheck, Users, Truck, Heart, Award, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  navigate: (route: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      
      {/* Title & Introduction */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C92520] bg-red-50 px-3 py-1 rounded">
          <span>Malpani Heritage</span>
          <span>·</span>
          <span>Sangamner, Maharashtra</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#272321] tracking-tight">
          Serving Families with Purity, Trust, and Daily Value
        </h1>
        <p className="text-base sm:text-lg text-[#6D6661] leading-relaxed">
          Malpani Sargam Super Mart represents the retail commitment of the legendary Malpani Group. Built on values of ethical trade, direct manufacturer sourcing, and customer-first service, we provide households with everything they need under one welcoming roof.
        </p>
      </div>

      {/* Heritage Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl border border-slate-200">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[#641E24]/10 flex items-center justify-center text-[#641E24]">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#272321]">
            A Century of Trust in Sangamner
          </h2>
          <p className="text-sm text-[#6D6661] leading-relaxed">
            The Malpani name has been woven into the fabric of Sangamner, Ahmednagar, and Maharashtra since 1894. With diversified interests in manufacturing, clean energy, education, healthcare, and hospitality, the group established Sargam Super Mart to elevate the grocery shopping experience for regional families.
          </p>
          <p className="text-sm text-[#6D6661] leading-relaxed">
            Today, our modern retail formats span multiple landmark locations in Sangamner, combining the warmth of a neighborhood grocer with the breadth, cleanliness, and efficiency of world-class supermarkets.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <div className="text-2xl font-bold text-[#C92520]">100%</div>
              <div className="text-xs text-slate-500 mt-1">Authentic Sourced Goods</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#C92520]">30,000+</div>
              <div className="text-xs text-slate-500 mt-1">Loyal Sangamner Households</div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF9F4] p-8 rounded-xl border border-slate-200 space-y-6">
          <h3 className="font-bold text-lg text-[#641E24]">Our Operational Principles</h3>
          <ul className="space-y-4 text-xs text-[#272321]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#23734B] shrink-0 mt-0.5" />
              <div>
                <strong>Direct Mill & Farmer Procurement:</strong> We partner directly with regional grain mills, dairy farms, and recognized FMCG manufacturers to eliminate middleman margins.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#23734B] shrink-0 mt-0.5" />
              <div>
                <strong>Hygienic Clean Storage & Cold Chain:</strong> Our warehousing and on-shelf storage maintain strict moisture control and dairy refrigeration protocols.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#23734B] shrink-0 mt-0.5" />
              <div>
                <strong>Transparent Pricing Every Day:</strong> Clear MRP vs. Mart Price displays on every aisle tag, ensuring fair savings on every monthly family ration.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#23734B] shrink-0 mt-0.5" />
              <div>
                <strong>Trained Neighborhood Staff:</strong> Courteous staff recruited locally, trained to handle groceries with utmost respect and hygiene.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Leadership Commitment */}
      <div className="bg-[#641E24] text-white rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
        <Heart className="w-10 h-10 text-[#EF8018] mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          "Our duty is to ensure that what goes into your family's kitchen is pure, fresh, and fairly priced."
        </h2>
        <div className="text-xs text-slate-300">
          — The Malpani Sargam Super Mart Management Team
        </div>
        <div className="pt-4">
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-sm rounded-xl transition-all shadow-md"
          >
            Start Your Grocery Basket →
          </button>
        </div>
      </div>

    </div>
  );
};
