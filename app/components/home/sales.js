"use client"
import React, { useState, useEffect } from 'react';

function Sales() {
  const deals = [
    {
      id: 1,
      title: 'Summer Outerwear',
      discount: '30% OFF',
      code: 'SUMMER30',
      desc: 'On all premium jackets & coats',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      title: 'Essential Tees Bundle',
      discount: 'Buy 2 Get 1',
      code: 'TEE3X2',
      desc: 'Mix & match everyday men\'s basics',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      title: 'Weekend Special',
      discount: 'Free Shipping',
      code: 'FREESHIP',
      desc: 'On all orders over $100 storewide',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through offers every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % deals.length);
    }, 12000); // 12 seconds

    return () => clearInterval(timer);
  }, [deals.length]);

  const currentDeal = deals[currentIndex];

  return (
    <div className="w-full mt-5 p-2 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(100,90,75,0.08)] text-[#3A3530] flex flex-col gap-3 font-sans overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E6E1DA] pb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2824]">Hot Deals & Offers</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="text-[10px] font-semibold text-[#8C7A6B]">
            {currentIndex + 1}/{deals.length}
          </span>
        </div>
      </div>

      {/* Single Rotating Deal Card with Image */}
      <div 
        key={currentDeal.id}
        className="group p-3 rounded-xl bg-white/70 hover:bg-white/95 border border-[#E6E1DA]/80 transition-all duration-500 ease-in-out cursor-pointer flex gap-3 items-center shadow-sm"
      >
        {/* Deal Thumbnail Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#EAE5DC]">
          <img 
            src={currentDeal.image} 
            alt={currentDeal.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-1 left-1 rounded bg-[#A56A43] px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
            {currentDeal.discount}
          </span>
        </div>

        {/* Deal Info */}
        <div className="flex flex-col flex-grow gap-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#2C2824] leading-tight">{currentDeal.title}</span>
          </div>
          
          <p className="text-[11px] text-[#7A7267] leading-tight line-clamp-2">{currentDeal.desc}</p>
          
          <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-[#E6E1DA]/50 text-[10px]">
            <span className="text-[#8C8275]">
              Code: <strong className="text-[#2C2824] tracking-wider bg-white/90 px-1.5 py-0.5 rounded border border-[#E6E1DA]/60">{currentDeal.code}</strong>
            </span>
            <span className="text-[#A56A43] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Claim &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-1.5 pt-0.5">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-5 bg-[#A56A43]' : 'w-1.5 bg-[#D4CFC7] hover:bg-[#A56A43]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

export default Sales;