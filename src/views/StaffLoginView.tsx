import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface StaffLoginViewProps {
  navigate: (route: string) => void;
}

export const StaffLoginView: React.FC<StaffLoginViewProps> = ({ navigate }) => {
  const { staffLogin, staffList } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = staffLogin(email);
    if (success) {
      navigate('admin');
    } else {
      setErrorMsg('Invalid staff credentials or account suspended.');
    }
  };

  const handleQuickRoleSwitch = (staffEmail: string) => {
    const success = staffLogin(staffEmail);
    if (success) {
      navigate('admin');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      
      {/* Login Box */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#641E24] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-[#EF8018]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C92520]">
            Authorized Personnel Only
          </span>
          <h1 className="text-2xl font-extrabold text-[#272321]">
            Malpani Sargam Staff & Admin Portal
          </h1>
          <p className="text-xs text-[#6D6661] max-w-sm mx-auto">
            Secure administrative console for branch inventory, order picking, pricing catalog, and customer fulfillment.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Staff Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. owner@sargammart.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Security PIN / Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#641E24] hover:bg-[#50171c] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate Staff Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fast Role Demonstration Access */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Staff Role Verification Presets</span>
            <UserCheck className="w-3.5 h-3.5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {staffList.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleQuickRoleSwitch(st.email)}
                className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-[#C92520] hover:bg-[#FFF9F4] transition-all"
              >
                <div className="font-bold text-[#272321]">{st.name}</div>
                <div className="text-[10px] text-[#C92520] font-semibold">{st.role.replace('_', ' ')}</div>
                <div className="text-[10px] text-slate-400 truncate">{st.email}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('home')}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            ← Return to Public Website
          </button>
        </div>

      </div>

    </div>
  );
};
