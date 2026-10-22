
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  UserRound,
  Settings,
  Bell,
  Package,
  ShoppingBag,
  Heart,
  ChevronRight,
  MapPin,
  CreditCard,
  LogOut,
  Tag,
} from "lucide-react";

export default function ProfileContent({ user }) {
  const router = useRouter();

  const [profile] = useState({
    full_name: user.user_metadata?.full_name || "",
    email: user.email || "",
  });

  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const shopping = [
    {
      name: "My Orders",
      desc: "Track your orders",
      icon: Package,
      link: "/user/orders",
    },
    {
      name: "My Cart",
      desc: "View your cart",
      icon: ShoppingBag,
      link: "/cart",
    },
    {
      name: "Wishlist",
      desc: "Your favourite items",
      icon: Heart,
      link: "/wishlist",
    },
  ];

  const account = [
    { name: "My Addresses", icon: MapPin, link: "/addresses" },
    { name: "Payment Methods", icon: CreditCard, link: "/payment-methods" },
    { name: "Account Settings", icon: Settings, link: "/settings" },
  ];

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 pt-28 pb-10 text-[#29231F] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Profile Header */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#A56A43]/10 text-[#A56A43]">
              <UserRound size={30} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#A56A43]">
                Your Account
              </p>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {profile.full_name || "Welcome to your account"}
              </p>
              <p className="text-sm text-neutral-500">{profile.email}</p>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="rounded-full border border-[#E9DFD4] bg-white p-3 hover:text-[#A56A43]"
            >
              <Bell size={19} />
            </Link>

            <Link
              href="/settings"
              aria-label="Settings"
              className="rounded-full border border-[#E9DFD4] bg-white p-3 hover:text-[#A56A43]"
            >
              <Settings size={19} />
            </Link>
          </div>
        </div>

        {/* Shopping Cards */}
        <h2 className="mb-4 text-xl font-semibold">Your Shopping</h2>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {shopping.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.link}
                className="group flex items-center justify-between rounded-2xl border border-[#E9DFD4] bg-white p-5 transition hover:-translate-y-1 hover:border-[#A56A43]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#FAF7F2] p-3 text-[#A56A43] group-hover:bg-[#A56A43] group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                </div>

                <ChevronRight size={18} />
              </Link>
            );
          })}
        </div>

        {/* Account Options */}
        <h2 className="mb-4 text-xl font-semibold">Account Details</h2>

        <div className="mb-10 overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white">
          {account.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.link}
                className={`flex items-center justify-between p-5 hover:bg-[#FAF7F2] ${
                  index !== account.length - 1
                    ? "border-b border-[#E9DFD4]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className="text-[#A56A43]" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>

                <ChevronRight size={18} className="text-neutral-400" />
              </Link>
            );
          })}
        </div>

        {/* Best Deals */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-[#A56A43] p-6 text-white sm:p-10">
          <div className="relative z-10 max-w-lg">
            <p className="mb-4 flex items-center gap-2 text-sm">
              <Tag size={16} />
              EXCLUSIVE OFFER
            </p>

            <h2 className="text-3xl font-semibold sm:text-5xl">
              Upgrade Your
              <br />
              Everyday Style.
            </h2>

            <p className="my-4 text-sm leading-6 text-white/80">
              Discover timeless essentials and fresh looks for your wardrobe.
            </p>

            <Link
              href="/shop"
              className="inline-block rounded-full bg-[#FAF7F2] px-6 py-3 text-sm font-semibold text-[#A56A43] hover:bg-white"
            >
              Explore Collection →
            </Link>
          </div>

          <span className="absolute -bottom-5 right-3 text-7xl font-bold text-white/10 sm:text-9xl">
            STYLE
          </span>
        </div>

        {/* Sign Out */}
        <div className="border-t border-[#E9DFD4] pt-5 text-center">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut size={17} />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>

          <p className="mt-3 text-xs text-neutral-400">
            Your style, your way.
          </p>
        </div>
      </div>
    </main>
  );
}
