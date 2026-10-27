"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  Store,
} from "lucide-react";

function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Deals & Offers", path: "/admin/deals", icon: Tags },
    { name: "Careers", path: "/admin/careers", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-16 md:w-64 flex-col border-r border-[#E9DFD4] bg-[#FAF7F2] px-2.5 md:px-5 py-6 md:py-7 transition-all duration-300">
      
      {/* Brand Logo Header */}
      <Link href="/admin" className="mb-8 flex items-center justify-center md:justify-start gap-3 px-1 md:px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] shadow-sm">
          <Store size={20} />
        </div>

        <div className="hidden md:block overflow-hidden">
          <h1 className="text-base font-bold tracking-tight text-[#29231F] whitespace-nowrap">
            UrbanWear
          </h1>
          <p className="text-[11px] font-medium text-gray-500">Admin Panel</p>
        </div>
      </Link>

      {/* Main Navigation */}
      <p className="mb-3 hidden md:block px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Main Menu
      </p>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.path === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              title={item.name} // Native browser tooltip when icon-only
              className={`flex items-center justify-center md:justify-start gap-3 rounded-2xl px-3 md:px-4 py-3 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#D9F99D] text-[#29231F] shadow-sm"
                  : "text-[#29231F]/80 hover:bg-[#F0EBE5] hover:text-[#29231F]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Store Switcher */}
      <div className="mt-auto border-t border-[#E9DFD4] pt-4">
        <Link
          href="/"
          title="View Store"
          className="flex items-center justify-center md:justify-start gap-3 rounded-2xl px-3 md:px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-[#F0EBE5] hover:text-[#29231F]"
        >
          <Store size={20} strokeWidth={1.8} className="shrink-0" />
          <span className="hidden md:inline whitespace-nowrap">View Store</span>
        </Link>

        <p className="mt-3 hidden md:block px-4 text-[10px] font-medium text-gray-400">
          Store Management
        </p>
      </div>

    </aside>
  );
}

export default AdminSidebar;