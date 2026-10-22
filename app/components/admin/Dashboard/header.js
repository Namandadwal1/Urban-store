import { Bell, CalendarDays } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9DFD4] pb-6">
      <div>
        <p className="mb-1 text-sm text-[#A56A43]">STORE OVERVIEW</p>
        <h1 className="text-2xl font-bold text-[#29231F] sm:text-3xl">
          Good morning, Admin!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Here's what's happening with your store today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-[#E9DFD4] bg-white px-3 py-2 sm:flex">
          <CalendarDays size={17} className="text-[#A56A43]" />
          <span className="text-sm text-[#29231F]">15 Oct 2026</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-[#E9DFD4] bg-white p-3 hover:bg-[#F0EBE5]"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#A56A43]" />
        </button>
      </div>
    </header>
  );
}