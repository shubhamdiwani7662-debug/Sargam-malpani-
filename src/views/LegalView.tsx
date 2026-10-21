import React, { useState } from 'react';

interface LegalViewProps {
  initialTab?: 'privacy' | 'terms';
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'privacy'
              ? 'border-[#C92520] text-[#C92520]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'terms'
              ? 'border-[#C92520] text-[#C92520]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Terms of Service & Delivery Rules
        </button>
      </div>

      {activeTab === 'privacy' ? (
        <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
          <h1 className="text-2xl font-extrabold text-[#272321]">Privacy Policy — Malpani Sargam Super Mart</h1>
          <p className="text-slate-500">Effective Date: October 2026 · Last Updated: 2026-10-21</p>
          
          <h3 className="text-base font-bold text-[#641E24] mt-6">1. Customer Information Collection</h3>
          <p>
            Malpani Sargam Super Mart ("we", "our", "us") collects only customer data necessary to process supermarket orders and fulfill home deliveries: name, contact telephone number, delivery address with landmarks, and email address for order receipts and status tracking.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">2. Zero Payment Credential Storage</h3>
          <p>
            All online debit card, credit card, netbanking, and UPI transactions are handled through PCI-DSS Level 1 certified payment gateways (Razorpay). Malpani Sargam Super Mart does not store, process, or view payment card CVVs, PINs, or confidential banking credentials.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">3. Use of Transactional Notifications</h3>
          <p>
            Your email and telephone numbers are used strictly for order verification, payment confirmations, delivery dispatch notices, and customer care responses. We do not sell, rent, or trade your contact information to third-party marketing companies.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">4. Contact For Privacy Queries</h3>
          <p>
            For any queries regarding customer records or account deletion, contact our Data Privacy Officer at privacy@sargammart.com or call +91 2425 225 500.
          </p>
        </article>
      ) : (
        <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
          <h1 className="text-2xl font-extrabold text-[#272321]">Terms of Service & Fulfillment Guidelines</h1>
          <p className="text-slate-500">Effective Date: October 2026</p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">1. Order Placement & Branch Selection</h3>
          <p>
            Online ordering is fulfilled on a store-by-store basis. Product prices, daily promotional discounts, and local inventory are tied to your selected Sargam Mart branch. Changing your branch location revalidates your cart items and prices.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">2. Pricing & Inaccuracies</h3>
          <p>
            While we strive for 100% price accuracy, all order totals are calculated and validated by our server checkout engine before order confirmation. Orders are subject to physical stock verification at the branch.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">3. Delivery Thresholds & Service Areas</h3>
          <p>
            Home delivery is provided within designated service radii of our Sangamner branches. Free delivery applies automatically to baskets meeting or exceeding the branch minimum threshold (typically ₹499). If an area falls outside our delivery route, store pickup is provided at no extra charge.
          </p>

          <h3 className="text-base font-bold text-[#641E24] mt-6">4. Return & Replacement Policy</h3>
          <p>
            Packaged grocery items damaged during transit or with seal defects can be returned at the time of delivery or within 24 hours at the fulfilling branch with original receipt for an immediate replacement or full refund.
          </p>
        </article>
      )}
    </div>
  );
};
