"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  RotateCcw, 
  RefreshCw, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronDown,
  Shirt,
  MessageCircle
} from "lucide-react";

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState("returns"); // "returns", "refunds", "exchanges"
  const [openFaq, setOpenFaq] = useState(null);

  const policies = {
    returns: {
      title: "Return Policy",
      description: "Items can be returned within 14 days of delivery provided they are unworn, unwashed, and have original tags attached.",
      steps: [
        "Select your order and request a return approval.",
        "Pack the item securely with all tags intact.",
        "Our courier partner will pick up the package within 48 hours."
      ]
    },
    refunds: {
      title: "Refund Policy",
      description: "Refunds are processed to your original payment method within 5–7 business days after inspection of returned items.",
      steps: [
        "Quality check of returned product at our fulfillment center.",
        "Refund initiation sent directly to your bank account or card.",
        "Instant credit added for Cash on Delivery (COD) orders as store credit."
      ]
    },
    exchanges: {
      title: "Exchange Policy",
      description: "Need a different size or color? Request a size exchange for free within 7 days of order delivery.",
      steps: [
        "Choose the replacement size or color.",
        "Doorstep pickup and exchange scheduled simultaneously.",
        "Zero additional delivery charges for your first size swap."
      ]
    }
  };

  const faqs = [
    {
      q: "How long does a return pickup take?",
      a: "Once approved, our courier partner will initiate pickup within 24 to 48 hours."
    },
    {
      q: "Are clearance or flash sale items eligible for return?",
      a: "Items marked as Final Sale or Flash Clearance are eligible for size exchange only."
    },
    {
      q: "How will I receive my refund for Cash on Delivery orders?",
      a: "For COD orders, refunds are issued either as instant store credit or transferred directly to your bank via UPI/NEFT details provided in your profile."
    }
  ];

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-12 sm:py-20 overflow-hidden">
      
      {/* Background Floating Ambient Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-3 py-1 rounded-full border border-[#cff281] shadow-sm mb-3">
            <HelpCircle size={12} /> Help Center & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#29231F]">
            Returns, Refunds & Exchanges
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Need help with an item? Manage your order returns, size exchanges, and refund requests with ease.
          </p>
        </div>

        {/* Quick Action Request Section (Interactive UI Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          
          <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition hover:border-[#D9F99D]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] mb-4">
                <RotateCcw size={22} />
              </div>
              <h3 className="text-base font-bold text-[#29231F]">Return an Item</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Initiate a hassle-free pickup for items you wish to send back.
              </p>
            </div>
            
            <button
              onClick={() => alert("Return module request action triggered! (Backend integration pending)")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#29231F] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95"
            >
              Request Return <ArrowRight size={14} />
            </button>
          </div>

          <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition hover:border-[#D9F99D]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] mb-4">
                <RefreshCw size={22} />
              </div>
              <h3 className="text-base font-bold text-[#29231F]">Exchange Size</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Swap your item for a different size or color for free.
              </p>
            </div>
            
            <button
              onClick={() => alert("Exchange request action triggered! (Backend integration pending)")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
            >
              Request Exchange <ArrowRight size={14} />
            </button>
          </div>

          <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition hover:border-[#D9F99D]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] mb-4">
                <CreditCard size={22} />
              </div>
              <h3 className="text-base font-bold text-[#29231F]">Check Refund Status</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Track the progress of your pending store or bank refund.
              </p>
            </div>
            
            <button
              onClick={() => alert("Refund status query triggered! (Backend integration pending)")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] border border-[#E9DFD4] py-3 text-xs font-bold text-[#29231F] transition hover:bg-white active:scale-95"
            >
              Check Refund <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* Policy Details Switcher Tabs */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm mb-10">
          
          <div className="flex items-center gap-2 border-b border-[#E9DFD4] pb-4 mb-6 overflow-x-auto">
            {[
              { id: "returns", label: "Return Policy", icon: RotateCcw },
              { id: "refunds", label: "Refund Process", icon: CreditCard },
              { id: "exchanges", label: "Size Exchange", icon: RefreshCw },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#D9F99D] text-[#29231F] shadow-sm scale-105"
                      : "bg-[#FAF7F2] border border-[#E9DFD4] text-neutral-600 hover:bg-white hover:text-[#29231F]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Policy Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#29231F]">
                {policies[activeTab].title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {policies[activeTab].description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#29231F] mb-3 flex items-center gap-2">
                <Clock size={14} /> How it works:
              </h4>

              <div className="space-y-3">
                {policies[activeTab].steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#29231F] text-[10px] font-bold text-[#D9F99D]">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-neutral-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* FAQs Accordion Section */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#29231F] mb-4">Frequently Asked Questions</h2>

          <div className="divide-y divide-[#E9DFD4]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between text-left font-bold text-xs sm:text-sm text-[#29231F]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-[#29231F]" : "text-neutral-400"
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Footer Note */}
        <div className="mt-10 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Still need assistance with your order?</span>
          <Link
            href="/#contact"
            className="font-bold text-[#29231F] underline decoration-[#D9F99D] decoration-2 flex items-center gap-1"
          >
            <MessageCircle size={14} /> Contact Customer Support
          </Link>
        </div>

      </div>
    </main>
  );
}   