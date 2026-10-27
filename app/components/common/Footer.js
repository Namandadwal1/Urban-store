"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiShoppingBag, 
  FiInstagram, 
  FiLinkedin,  
  FiTwitter 
} from "react-icons/fi";
import { PiYoutubeLogoLight } from "react-icons/pi";


export default function Footer() {
  const pathname = usePathname();

  // Hide the global website footer on all admin dashboard routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Products", href: "/products" },
        { name: "Categories", href: "/#category" },
        { name: "Deals & Offers", href: "/#offers" },
        { name: "Best Sellers", href: "/#products" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "My Orders", href: "/user/orders" },
        { name: "Shopping Cart", href: "/cart" },
        { name: "Profile", href: "/profile" },
        // { name: "Wishlist", href: "/profile" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Products", href: "/products" },
        { name: "Help & Support", href: "/user/help" },
        { name: "Careers & Collaborations", href: "/user/career" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F] pb-24 md:pb-12 pt-12">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 mb-12">
          
          {/* Left Side: Brand Logo, Tagline, & Social Icons */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F] shadow-sm transition-transform group-hover:scale-105">
                <FiShoppingBag size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#29231F]">
                UrbanWear
              </span>
            </Link>

            <p className="max-w-sm text-sm text-neutral-600 leading-relaxed">
              UrbanWear empowers fashion enthusiasts with curated, premium apparel made for everyday comfort and contemporary lifestyle.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/namandadwal0"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-all hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                aria-label="Twitter"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/namandadwal.0/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-all hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                aria-label="Instagram"
              >
                <FiInstagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/naman-dadwal-449985280/?isSelfProfile=true"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-all hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={16} />
              </a>
              <a
                href="https://www.youtube.com/@DadwalDevelopers"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] transition-all hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                aria-label="YouTube"
              >
                <PiYoutubeLogoLight size={16} />

              </a>
            </div>
          </div>

          {/* Right Side: Columns Navigation */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#29231F]">
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-2.5 text-sm text-neutral-600">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-[#29231F] hover:underline decoration-[#D9F99D] underline-offset-4"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar Area */}
        <div className="flex flex-col gap-4 border-t border-[#E9DFD4] pt-6 md:flex-row md:items-center md:justify-between text-xs text-neutral-500">
          <p>© 2026 UrbanWear. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#29231F] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#29231F] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-[#29231F] transition-colors">
              Cookies Settings
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}