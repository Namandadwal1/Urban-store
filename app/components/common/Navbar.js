"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Home,
  ShoppingBag, 
  LogOut, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  User as UserIcon,
  Menu,
  X,
  Shirt,
  HelpCircle,
  Briefcase,
  Info
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Memoize supabase client instance
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function checkUser() {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error || !currentUser) {
          if (isMounted) {
            setUser(null);
            setIsAdmin(false);
          }
          return;
        }

        if (isMounted) setUser(currentUser);

        const { data: adminRecord, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (isMounted) {
          setIsAdmin(!adminError && !!adminRecord);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser();
      } else {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Lock body scroll when mobile menu shutter is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  async function signOut() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  // Navigation links array
  const primaryLinks = [
    { name: "Products", path: "/products", icon: Package },
    { name: "Career & Collaboration", path: "/user/career", icon: Briefcase },
    { name: "Profile", path: "/profile", icon: UserIcon },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
    { name: "Help", path: "/user/help", icon: HelpCircle },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <>
      {/* ================= DESKTOP & TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E9DFD4] bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F] shadow-sm transition-transform group-hover:scale-105">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#29231F]">
                Urban Wear
              </span>
            </Link>
          </div>

          {/* Right Actions: Dashboard, Cart, Profile, Auth */}
          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="h-9 w-16 animate-pulse rounded-lg bg-neutral-200" />
                <div className="h-9 w-20 animate-pulse rounded-lg bg-neutral-300" />
              </div>
            ) : !user ? (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-[#29231F] transition-colors hover:bg-neutral-200/60"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[#29231F] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pl-2">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 rounded-xl bg-[#D9F99D] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#29231F] shadow-sm transition-all hover:brightness-95 active:scale-95"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-colors hover:bg-neutral-50"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </Link>
                <Link
                  href="/profile"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-colors hover:bg-neutral-50"
                  aria-label="Profile"
                >
                  <UserIcon size={18} />
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E9DFD4] bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-95"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Sub-Row Links (Desktop) */}
        <div className="hidden border-t border-[#E9DFD4] bg-white/50 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-2.5 md:px-8 overflow-x-auto">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#29231F] whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MOBILE SHUTTER MENU DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#FAF7F2] text-[#29231F] animate-in fade-in slide-in-from-bottom duration-300 md:hidden">
          {/* Shutter Header */}
          <div className="flex items-center justify-between border-b border-[#E9DFD4] px-5 py-4 bg-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F]">
                <ShoppingBag size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight">Urban Wear Menu</span>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F] hover:bg-neutral-200"
              aria-label="Close Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Shutter Body Links */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Quick Navigation
            </p>

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl bg-[#D9F99D] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#29231F] shadow-sm mb-4"
              >
                <LayoutDashboard size={18} /> Admin Dashboard
              </Link>
            )}

            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#29231F] text-white shadow-sm"
                      : "bg-white border border-[#E9DFD4] text-[#29231F] hover:bg-neutral-50"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#D9F99D]" : "text-neutral-500"} />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-6 border-t border-[#E9DFD4] mt-6">
              {!user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-[#E9DFD4] bg-white py-3 text-xs font-bold text-[#29231F] shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[#29231F] py-3 text-xs font-bold text-white shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={signOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-600 shadow-sm"
                >
                  <LogOut size={16} /> Sign Out of Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE FLOATING BOTTOM BAR ================= */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <nav className={`mx-auto flex max-w-md items-center justify-around rounded-3xl border border-[#E9DFD4] bg-white/95 px-3 py-3 shadow-2xl backdrop-blur-xl ${
          isAdmin ? "grid grid-cols-6" : ""
        }`}>
          
          {/* 1. Home Link */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === "/" ? "text-[#29231F]" : "text-neutral-500 hover:text-[#29231F]"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${pathname === "/" ? "bg-[#D9F99D] text-[#29231F] font-bold" : ""}`}>
              <Home size={18} />
            </div>
            <span className="text-[9px] font-medium tracking-wide">Home</span>
          </Link>

          {/* 2. Products Catalog Link */}
          <Link
            href="/products"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === "/products" ? "text-[#29231F]" : "text-neutral-500 hover:text-[#29231F]"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${pathname === "/products" ? "bg-[#D9F99D] text-[#29231F] font-bold" : ""}`}>
              <Shirt size={18} />
            </div>
            <span className="text-[9px] font-medium tracking-wide">Products</span>
          </Link>

          {/* 3. Conditional Admin Dashboard Link in Mobile Nav */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`flex flex-col items-center gap-1 transition-colors ${
                pathname?.startsWith("/admin") ? "text-[#29231F]" : "text-neutral-500 hover:text-[#29231F]"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${pathname?.startsWith("/admin") ? "bg-[#D9F99D] text-[#29231F] font-bold" : "bg-[#D9F99D]/30"}`}>
                <LayoutDashboard size={18} />
              </div>
              <span className="text-[9px] font-medium tracking-wide">Admin</span>
            </Link>
          )}

          {/* 4. Center Raised Profile Button */}
          <div className="relative -top-5 flex justify-center">
            <Link
              href={user ? "/profile" : "/login"}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9F99D] text-[#29231F] shadow-lg ring-4 ring-[#FAF7F2] transition-transform hover:scale-105 active:scale-95"
              aria-label="User Profile"
            >
              <UserIcon size={22} strokeWidth={2.2} />
            </Link>
          </div>

          {/* 5. Cart Link */}
          <Link
            href={user ? "/cart" : "/login"}
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === "/cart" ? "text-[#29231F]" : "text-neutral-500 hover:text-[#29231F]"
            }`}
          >
            <div className={`p-1.5 rounded-xl relative ${pathname === "/cart" ? "bg-[#D9F99D] text-[#29231F]" : ""}`}>
              <ShoppingCart size={18} />
              {user && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
            </div>
            <span className="text-[9px] font-medium tracking-wide">Cart</span>
          </Link>

          {/* 6. Menu Shutter Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-neutral-500 transition-colors hover:text-[#29231F] focus:outline-none"
            aria-label="Open Menu"
          >
            <div className="p-1.5 rounded-xl bg-neutral-100">
              <Menu size={18} />
            </div>
            <span className="text-[9px] font-medium tracking-wide">Menu</span>
          </button>

        </nav>
      </div>
    </>
  );
}