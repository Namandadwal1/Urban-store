"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    itemCount: "New Drop",
  },
  {
    name: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    itemCount: "Casual & Formal",
  },
  {
    name: "Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    itemCount: "Premium Denim",
  },
  {
    name: "Trousers",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    itemCount: "Tailored Fit",
  },
  {
    name: "Jackets",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800",
    itemCount: "Outerwear",
  },
  {
    name: "Ethnic Wear",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    itemCount: "Festive Edit",
  },
];

export default function Category() {
  return (
    <section className="w-full bg-[#FAF7F2] py-12 px-5 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* Subtitle updated from brown to dark neutral */}
            <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#29231F]/80">
              Find Your Style
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#29231F] md:text-4xl">
              Shop by Category
            </h2>
          </div>

          {/* Link hover updated to accent color #D9F99D */}
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 border-b border-[#29231F] pb-1 text-sm font-medium text-[#29231F] transition-colors hover:text-black hover:border-[#D9F99D]"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/60 p-3 border border-[#E9DFD4] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F5F2ED] mb-3 border border-[#E9DFD4]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Floating Badge Overlay */}
                <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold tracking-wide bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[#29231F] border border-[#E9DFD4] shadow-sm">
                  {category.itemCount}
                </span>
              </div>

              {/* Category Title & Action */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#29231F] group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                </div>

                {/* Arrow icon background on hover changed to #D9F99D */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F2ED] border border-[#E9DFD4] text-[#29231F] transition-all duration-300 group-hover:bg-[#D9F99D] group-hover:border-[#D9F99D] group-hover:text-[#29231F]">
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-b border-[#29231F] pb-1 text-sm font-medium text-[#29231F]"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}