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
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-[#E9DFD4] bg-[#FAF7F2] px-5 py-7">
      {/* Logo */}
      <Link href="/admin" className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#A56A43]">
          <Store size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide text-[#29231F]">
            UrbanWear
          </h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </Link>

      {/* Navigation */}
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Main Menu
      </p>

      <nav className="flex flex-col gap-2">
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
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-[#EFE7DE] text-[#A56A43]"
                  : "text-[#29231F] hover:bg-[#F0EBE5]"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[#E9DFD4] pt-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#F0EBE5] hover:text-[#29231F]"
        >
          <Store size={19} strokeWidth={1.8} />
          View Store
        </Link>

        <p className="mt-4 px-4 text-xs text-gray-400">
          Store Management
        </p>
      </div>
    </aside>
  );
}

export default AdminSidebar;