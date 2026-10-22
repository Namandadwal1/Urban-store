
import Link from "next/link";

export default function Footer() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "My Orders", href: "/orders" },
    { name: "My Account", href: "/profile" },
    { name: "Careers", href: "/careers" },
  ];

  return (
    <footer className="border-t border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide"
          >
            YOUR BRAND
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-[#A56A43]"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-[#E9DFD4] pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} YOUR BRAND. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
