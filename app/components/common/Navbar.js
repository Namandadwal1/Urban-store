"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, ShoppingBag, UserRound, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        setIsAdmin(!!data);
      }

      setLoading(false);
    }

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/#products" },
  { name: "Categories", path: "/#category" },
  { name: "Offers", path: "/#offers" },
  { name: "Contact", path: "/#contact" },
  { name: "Collab", path: "/#collab" },
];

  if (user) {
    navLinks.push(
      { name: "My Orders", path: "/user/orders" },
      { name: "My Cart", path: "/cart" },
      { name: "Profile", path: "/profile" }
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E9DFD4] bg-[#FAF7F2]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag size={25} className="text-[#A56A43]" />
          <span className="text-xl font-bold tracking-wide text-[#29231F]">
            UrbanWear
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path}
              className="text-sm font-medium text-[#29231F] hover:text-[#A56A43]">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && !user && (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm hover:bg-[#F0EBE5]">
                Sign In
              </Link>
              <Link href="/register" className="rounded-lg bg-[#29231F] px-5 py-2.5 text-sm text-white hover:bg-[#A56A43]">
                Sign Up
              </Link>
            </>
          )}

          {!loading && user && isAdmin && (
            <Link href="/admin/dashboard" className="flex items-center gap-2 rounded-lg bg-[#A56A43] px-4 py-2.5 text-sm text-white hover:bg-[#875333]">
              <LayoutDashboard size={17} /> Admin Dashboard
            </Link>
          )}

          {!loading && user && (
            <button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-[#E9DFD4] px-4 py-2.5 text-sm hover:bg-[#F0EBE5]">
              <LogOut size={17} /> Sign Out
            </button>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-[#29231F] hover:bg-[#F0EBE5] md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#E9DFD4] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm hover:bg-[#F0EBE5]">
                {link.name}
              </Link>
            ))}
          </div>

          {!loading && !user && (
            <div className="mt-3 flex gap-3">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-[#E9DFD4] py-2.5 text-center text-sm">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-[#29231F] py-2.5 text-center text-sm text-white">
                Sign Up
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="mt-3 flex flex-col gap-2 border-t border-[#E9DFD4] pt-3">
              {isAdmin && (
                <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-[#A56A43] px-3 py-3 text-sm text-white">
                  <LayoutDashboard size={17} /> Admin Dashboard
                </Link>
              )}
              <button onClick={signOut}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm hover:bg-[#F0EBE5]">
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}