"use client";

import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Users, 
  History, 
  Award, 
  Compass, 
  Mail, 
  Clock, 
  Phone, 
  ArrowRight,
  Shirt
} from "lucide-react";

// Team & Founder Data with SVG Character Avatars
const teamMembers = [
  {
    name: "Aarav Sharma",
    role: "Founder & Brand Director",
    bio: "Passionate about minimalist street fashion, Aarav started UrbanWear to blend comfort with contemporary aesthetic apparel.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav",
  },
  {
    name: "Rohan Verma",
    role: "Co-Founder & Operations Lead",
    bio: "Ensures seamless store management, ethical supply chains, and top-tier customer satisfaction across all store orders.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan",
  },
  {
    name: "Priya Nair",
    role: "Head of Creative Design",
    bio: "The creative mind behind our modern streetwear cuts, fabric selection, and seasonal minimalist drops.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
  },
  {
    name: "Kabir Mehta",
    role: "Store Manager & Styling Lead",
    bio: "Oversees physical store operations and curates personalized styling recommendations for in-store customers.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kabir",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-12 sm:py-20 overflow-hidden">
      
      {/* Background Floating Ambient Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-16">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-3 py-1 rounded-full border border-[#cff281] shadow-sm mb-3">
            <Sparkles size={12} /> Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#29231F]">
            About UrbanWear
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Crafting minimalist everyday apparel designed for comfort, durability, and contemporary streetwear aesthetics.
          </p>
        </div>

        {/* Store Brand Story Section */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#29231F]">
              <History size={16} /> How It Started
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#29231F]">
              From a Small Workshop to a Growing Fashion Brand
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              UrbanWear was founded with a simple objective: to eliminate fast-fashion compromise and offer high-quality, everyday wardrobe staples crafted with premium fabrics.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              What started as a modest boutique studio with just a few custom-designed shirts has grown into a modern online catalog and physical retail store serving streetwear enthusiasts across the region.
            </p>

            <div className="pt-2 flex items-center gap-6 text-center">
              <div className="rounded-2xl bg-[#FAF7F2] border border-[#E9DFD4] p-3 flex-1">
                <span className="block text-xl font-extrabold text-[#29231F]">10K+</span>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase">Happy Customers</span>
              </div>
              <div className="rounded-2xl bg-[#FAF7F2] border border-[#E9DFD4] p-3 flex-1">
                <span className="block text-xl font-extrabold text-[#29231F]">100%</span>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase">Premium Cotton</span>
              </div>
              <div className="rounded-2xl bg-[#D9F99D] p-3 flex-1">
                <span className="block text-xl font-extrabold text-[#29231F]">4.9★</span>
                <span className="text-[10px] font-bold text-[#29231F] uppercase">Store Rating</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD4] p-6 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
              <Shirt size={100} className="text-[#29231F]/10 absolute -bottom-4 -right-4" />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] shadow-sm mb-4">
                <Compass size={32} />
              </div>
              <h3 className="font-bold text-base text-[#29231F]">Our Philosophy</h3>
              <p className="mt-2 text-xs text-neutral-500 max-w-xs">
                Minimalist tailoring, ethical manufacturing, and effortless everyday streetwear styling.
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center justify-center gap-1.5">
              <Users size={14} /> The Team Behind UrbanWear
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#29231F] mt-1">
              Meet Our Founders & Creators
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:border-[#D9F99D] hover:shadow-md flex flex-col items-center text-center justify-between"
              >
                <div>
                  {/* Character Avatar PNG/SVG */}
                  <div className="relative h-28 w-28 rounded-full bg-[#FAF7F2] border-2 border-[#E9DFD4] p-2 mb-4 mx-auto group-hover:scale-105 transition-transform">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#29231F]">
                    {member.name}
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full">
                    {member.role}
                  </span>

                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Location & Contact Details */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <MapPin size={16} /> Physical Store Location
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#29231F]">
                Visit Our Flagship Store
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Experience our full streetwear collection in person. Try on custom sizing, consult our stylists, or pick up online orders directly from our flagship storefront.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#29231F]">
                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">UrbanWear Flagship Outlet</p>
                    <p className="text-neutral-500 text-xs">
                      102 Fashion Boulevard, Mall Road, Shimla, HP - 171001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-neutral-500 shrink-0" />
                  <p className="text-xs text-neutral-600">
                    <span className="font-bold text-[#29231F]">Mon - Sat:</span> 10:00 AM – 8:30 PM
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-neutral-500 shrink-0" />
                  <p className="text-xs text-neutral-600">+91 98765 43210</p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-neutral-500 shrink-0" />
                  <p className="text-xs text-neutral-600">support@urbanwear.com</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29231F] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-neutral-800"
                >
                  Explore Online Store <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Embedded Location Map Preview Box */}
            <div className="lg:col-span-6">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#E9DFD4] shadow-sm">
                    Interactive Map Preview
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="text-center my-auto space-y-2">
                  <MapPin size={40} className="mx-auto text-[#29231F]" />
                  <h4 className="font-bold text-sm text-[#29231F]">Store Directions</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Located near the central shopping district with dedicated customer parking.
                  </p>
                </div>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2.5 rounded-xl bg-[#D9F99D] text-xs font-bold text-[#29231F] shadow-sm hover:brightness-95 transition-all"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}