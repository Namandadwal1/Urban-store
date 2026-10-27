"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  Shirt, 
  Scissors, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Mail,
  Calendar
} from "lucide-react";

export default function ProfileContent({ user, initialProfile }) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  const fullName = initialProfile?.full_name || user.user_metadata?.full_name || "Urban Enthusiast";
  const email = user.email || "";
  const joinedDate = new Date(user.created_at || Date.now()).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  async function handleSignOut() {
    setLoadingSignOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-10 sm:py-16 overflow-hidden">
      
      {/* Floating Background Ambient Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      {/* Background Graphic Decorators */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-10 right-10 text-[#29231F] rotate-12">
          <Shirt size={140} strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-10 text-[#29231F] -rotate-12">
          <ShoppingBag size={150} strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 left-1/3 text-[#29231F] rotate-45 hidden md:block">
          <Scissors size={90} strokeWidth={1} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        
        {/* Profile Banner / Header Card */}
        <div className="mb-8 rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar Circle */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] shadow-sm font-bold text-2xl uppercase">
                {fullName.slice(0, 2)}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E9DFD4] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#29231F] uppercase tracking-wider mb-1">
                  <ShieldCheck size={12} className="text-emerald-600" /> Verified Member
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#29231F]">{fullName}</h1>
                <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><Mail size={13} /> {email}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> Member since {joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={loadingSignOut}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-95 disabled:opacity-60"
            >
              <LogOut size={16} />
              {loadingSignOut ? "Signing out..." : "Sign Out"}
            </button>

          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E9DFD4] pb-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "orders", label: "My Orders", icon: ShoppingBag },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#D9F99D] text-[#29231F] shadow-sm"
                    : "bg-white/60 border border-[#E9DFD4] text-neutral-600 hover:bg-white hover:text-[#29231F]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
          
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#29231F]">Quick Activity</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/user/orders" className="flex items-center justify-between rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 transition hover:border-[#D9F99D]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#29231F] border border-[#E9DFD4]">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">Orders</p>
                      <p className="text-sm font-bold text-[#29231F]">View Details</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-neutral-400" />
                </Link>

                <div className="flex items-center gap-3 rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#29231F] border border-[#E9DFD4]">
                    <Heart size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500">Wishlist</p>
                    <p className="text-sm font-bold text-[#29231F]">Saved Items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#29231F] border border-[#E9DFD4]">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500">Status</p>
                    <p className="text-sm font-bold text-[#29231F]">Active Account</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="py-8 text-center">
              <ShoppingBag size={40} className="mx-auto mb-3 text-neutral-300" />
              <h3 className="text-base font-bold text-[#29231F]">No Recent Purchases</h3>
              <p className="mt-1 text-xs text-neutral-500">Explore our collection to place your first order.</p>
              <Link href="/products" className="inline-flex items-center justify-center gap-2 mt-4 rounded-xl bg-[#D9F99D] px-4 py-2.5 text-xs font-bold text-[#29231F] shadow-sm hover:brightness-95">
                Browse Products
              </Link>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="py-8 text-center">
              <Heart size={40} className="mx-auto mb-3 text-neutral-300" />
              <h3 className="text-base font-bold text-[#29231F]">Your Wishlist is Empty</h3>
              <p className="mt-1 text-xs text-neutral-500">Save items you love to keep track of them here.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-bold text-[#29231F]">Account Info</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F] mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={fullName}
                  readOnly
                  className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-4 py-2.5 text-xs text-[#29231F] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F] mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={email}
                  readOnly
                  className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-4 py-2.5 text-xs text-[#29231F] outline-none"
                />
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}