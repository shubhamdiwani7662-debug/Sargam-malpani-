import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, Award, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { branches } = useStore();

  return (
    <footer className="bg-[#272321] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#EF8018]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">100% Genuine Quality</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct sourcing from verified brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#C92520]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Fast Local Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Delivered safely to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#23734B]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Malpani Heritage</h4>
              <p className="text-xs text-slate-400 mt-0.5">Generations of consumer trust</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#EF8018]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Convenient Store Pickup</h4>
              <p className="text-xs text-slate-400 mt-0.5">Order online, pick up in 45 mins</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          
          {/* Column 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img
                src="/assets/aistudio/images_50b51d64.png"
                alt="Malpani Sargam Super Mart"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Malpani Sargam Super Mart is the flagship retail destination across Sangamner and Ahmednagar district. Offering over 10,000+ handpicked products across groceries, fresh dairy, household cleaning, personal care, and festive provisions.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C92520]" />
                <span>Customer Care: +91 2425 225 500 / 226 120</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#EF8018]" />
                <span>Support: support@sargammart.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-white transition-colors">
                  Corporate Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-white transition-colors">
                  Shop Online Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  About Sargam Mart
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-white transition-colors">
                  Store Departments
                </button>
              </li>
              <li>
                <button onClick={() => navigate('stores')} className="hover:text-white transition-colors">
                  Supermarket Branches
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('account')} className="hover:text-white transition-colors">
                  My Orders & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Terms & Delivery Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Return & Refund Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Supplier / Vendor Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Branches */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Our Branches</h4>
            <div className="space-y-3 text-xs">
              {branches.map((branch) => (
                <div key={branch.id} className="text-slate-400">
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#C92520] shrink-0" />
                    <span>{branch.name}</span>
                  </div>
                  <p className="text-[11px] mt-0.5 text-slate-400">{branch.address}, {branch.city}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Malpani Sargam Super Mart. All Rights Reserved. A proud enterprise of Malpani Group.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('terms')}
              className="hover:text-slate-400 transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('staff-login')}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-[11px]"
              title="Staff Portal (Authorized Personnel Only)"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
