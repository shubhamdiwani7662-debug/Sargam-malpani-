import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { branches } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Customer Service Enquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#272321] tracking-tight">
          Contact Customer Care & Stores
        </h1>
        <p className="text-sm text-[#6D6661]">
          Have a question about an order, product availability, or vendor onboarding? Reach out to our Sangamner support desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#23734B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#272321]">Thank You For Your Message!</h3>
              <p className="text-xs text-[#6D6661] max-w-md mx-auto">
                Our customer service team has received your inquiry. We typically respond within 24 business hours or via telephone for urgent order queries.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: 'Customer Service Enquiry', message: '' });
                }}
                className="text-xs font-bold text-[#C92520] hover:underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-[#641E24]">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98221 00000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520] bg-white"
                  >
                    <option>Customer Service Enquiry</option>
                    <option>Order Delivery Status</option>
                    <option>Product Availability Request</option>
                    <option>Vendor / Supplier Partnership</option>
                    <option>Store Feedback / Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please write your questions or order number details here..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C92520]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Direct Contacts & Central Desk */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFF9F4] p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-[#641E24]">Head Office & Central Desk</h3>
            
            <div className="space-y-3 text-xs text-[#272321]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C92520] shrink-0 mt-0.5" />
                <div>
                  <strong>Malpani Sargam Super Mart Head Office</strong><br/>
                  Malpani Estate, Sangamner-Pune Road, Sangamner, Maharashtra 422605
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#23734B] shrink-0" />
                <div>
                  <strong>Direct Lines:</strong> +91 2425 225 500 / +91 2425 226 120
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EF8018] shrink-0" />
                <div>
                  <strong>Email:</strong> support@sargammart.com / orders@sargammart.com
                </div>
              </div>
            </div>
          </div>

          {/* Quick branch hotline cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#641E24] uppercase tracking-wider">Branch Phone Desks</h4>
            {branches.map((b) => (
              <div key={b.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#272321]">{b.name}</div>
                  <div className="text-slate-500">{b.timings}</div>
                </div>
                <a
                  href={`tel:${b.phone}`}
                  className="font-mono font-bold text-[#C92520] hover:underline"
                >
                  {b.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
