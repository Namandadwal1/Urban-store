"use client";
import React from "react";
import { ArrowUpRight, Heart, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="w-full min-h-screen  sm:p-6 lg:p-8 flex flex-col justify-center items-center font-sans text-neutral-900">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        
        {/* ================= TOP MAIN HERO CARD ================= */}
        <div className="relative w-full bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-neutral-200/60 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">
          
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start gap-6 z-10">
            {/* Tag / Badge */}
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Autumn / Winter Collection</span>
            </div> */}

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
              Minimal Aesthetic <br />
              Studio Wear.
            </h1>

            {/* Step/Detail pointer */}
            <div className="flex items-center gap-4 py-2 text-sm text-neutral-500 max-w-sm">
              <span className="text-3xl font-light text-neutral-300">01</span>
              <div className="w-8 h-[1px] bg-neutral-300"></div>
              <div>
                <p className="font-semibold text-neutral-800 text-xs uppercase tracking-wider">Premium Wool</p>
                <p className="text-xs text-neutral-500">Crafted from sustainable merino wool made for timeless everyday wear.</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="flex items-center gap-3 bg-[#D9F99D] hover:bg-[#bef264] text-neutral-900 font-semibold pl-6 pr-2 py-2 rounded-full transition-all group">
              <Link href="/products"><span>Explore Collection</span></Link>
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>

            {/* Social / Footnote */}
            <p className="text-xs text-neutral-400 pt-4">
              Follow us on: <span className="underline cursor-pointer ml-1 text-neutral-600">Instagram</span> &bull; <span className="underline cursor-pointer text-neutral-600">TikTok</span>
            </p>
          </div>

          {/* Right Image Container */}
          <div className="flex-1 w-full flex justify-center items-center relative">
            <div className="relative w-64 sm:w-80 lg:w-96 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                alt="Featured Outfit"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating decorative dot */}
            <div className="absolute -top-4 right-8 w-6 h-6 rounded-full bg-neutral-200 hidden sm:block"></div>
          </div>
        </div>

        {/* ================= BOTTOM BENTO CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Mini Catalog */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/60 flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">More Arrivals</h4>
                <p className="text-xs text-neutral-400">120+ new styles</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            {/* Mini Images Row */}
            <div className="grid grid-cols-3 gap-2">
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200" alt="Cloth 1" className="w-full aspect-square object-cover rounded-xl bg-neutral-100" />
              <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200" alt="Cloth 2" className="w-full aspect-square object-cover rounded-xl bg-neutral-100" />
              <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=200" alt="Cloth 3" className="w-full aspect-square object-cover rounded-xl bg-neutral-100" />
            </div>
          </div>

          {/* Card 2: Social Proof / Community */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/60 flex flex-col items-center justify-center text-center gap-3">
            <div className="flex -space-x-2">
              <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="User" />
              <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" />
              <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-neutral-900">45k+ Happy Clients</p>
              <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5 rating community</span>
              </div>
            </div>
          </div>

          {/* Card 3: Trending / Featured */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200/60 flex items-center justify-between gap-4">
            <div className="flex flex-col justify-between h-full gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Popular Choice</span>
              <p className="font-bold text-sm leading-snug text-neutral-900">
                Oversized Trench <br /> has been restocked.
              </p>
              <button className="text-xs font-semibold text-neutral-900 underline flex items-center gap-1">
                Quick view <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=300"
              alt="Popular item"
              className="w-24 h-28 object-cover rounded-xl"
            />
          </div>

        </div>

      </div>
    </div>
  );
}