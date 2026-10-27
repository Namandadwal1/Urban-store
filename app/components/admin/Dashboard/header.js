"use client";

import React, { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Dynamically format current date (e.g. "24 Oct 2026")
    const date = new Date();
    setFormattedDate(
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9DFD4] pb-5 md:pb-6">
      
      {/* Title & Greeting Area */}
      <div>
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#d0f589]">
            Store Overview
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#29231F] sm:text-2xl md:text-3xl">
          Good morning, Admin!
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Date & Notification Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 self-start sm:self-center w-full sm:w-auto pt-1 sm:pt-0">
        
        {/* Date Display Pill */}
        <div className="flex items-center gap-2 rounded-xl border border-[#E9DFD4] bg-white/80 px-3 py-2 text-xs sm:text-sm text-[#29231F] shadow-sm backdrop-blur-md">
          <CalendarDays size={16} className="text-[#29231F]" />
          <span className="font-semibold">{formattedDate || "Today"}</span>
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9DFD4] bg-white text-[#29231F] shadow-sm transition-all hover:bg-[#D9F99D] hover:border-[#D9F99D] active:scale-95"
        >
          <Bell size={18} />
          {/* Unread Alert Dot styled in #29231F with #D9F99D ring */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#29231F] ring-2 ring-[#D9F99D]" />
        </button>

      </div>

    </header>
  );
}