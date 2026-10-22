"use client"
import React, { useState } from 'react';

function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(500);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);

  const categories = ['All', 'Shirts', 'Pants', 'Dresses', 'Outerwear', 'Accessories'];

  return (
    <aside className="sticky top-2 left-3 h-screen w-64 p-5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_0_rgba(100,90,75,0.08)] text-[#3A3530] flex flex-col gap-5 font-sans overflow-y-auto shrink-0">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E6E1DA] pb-3">
        <h2 className="text-sm font-bold tracking-wide text-[#2C2824]">Filters</h2>
        <button 
          onClick={() => {
            setSelectedCategory('All');
            setPriceRange(500);
            setDealsOnly(false);
            setMinDiscount(0);
          }}
          className="text-[11px] font-medium text-[#7A7267] hover:text-[#2C2824] transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Deals & Discounts Section */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[11px] font-bold tracking-wider uppercase text-[#6E6354]">Deals & Discounts</h3>
        
        <label className="flex items-center gap-2.5 cursor-pointer text-xs group">
          <input 
            type="checkbox" 
            checked={dealsOnly} 
            onChange={(e) => setDealsOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#D4CFC7] text-[#8C7A6B] focus:ring-0 cursor-pointer accent-[#7A6B5D]"
          />
          <span className="group-hover:text-[#1F1C18] transition-colors">Special Deals & Offers</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs group">
          <input 
            type="checkbox" 
            checked={minDiscount >= 20} 
            onChange={(e) => setMinDiscount(e.target.checked ? 20 : 0)}
            className="w-3.5 h-3.5 rounded border-[#D4CFC7] text-[#8C7A6B] focus:ring-0 cursor-pointer accent-[#7A6B5D]"
          />
          <span className="group-hover:text-[#1F1C18] transition-colors">20% Off or More</span>
        </label>
      </div>

      {/* Categories Section */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[11px] font-bold tracking-wider uppercase text-[#6E6354]">Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-all ${
                selectedCategory === cat 
                  ? 'bg-white/60 font-semibold text-[#2C2824] shadow-sm' 
                  : 'text-[#6E655B] hover:bg-white/30 hover:text-[#2C2824]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-bold tracking-wider uppercase text-[#6E6354]">Max Price</h3>
          <span className="text-[11px] font-semibold text-[#2C2824] bg-white/50 px-2 py-0.5 rounded-md border border-[#E6E1DA]">
            \${priceRange}
          </span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="1000" 
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#7A6B5D] cursor-pointer bg-[#E6E1DA] h-1.5 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-[#8C8275]">
          <span>\$10</span>
          <span>\$1,000</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;