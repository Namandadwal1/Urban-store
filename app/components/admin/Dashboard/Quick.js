import { ArrowUpRight, Tag, Users } from "lucide-react";
import Link from "next/link";

const links = [
  {
    title: "Deals & Offers",
    description: "Manage your store promotions",
    path: "/admin/deals",
    icon: Tag,
  },
  {
    title: "Careers & Applications",
    description: "Review openings and applicants",
    path: "/admin/careers",
    icon: Users,
  },
];

export default function Quick() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.path}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E9DFD4] bg-white/80 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-[#D9F99D] hover:bg-white hover:shadow-md active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Icon Container with #D9F99D Theme */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F] shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Icon size={20} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-[#29231F] truncate group-hover:text-black transition-colors">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1 sm:line-clamp-none">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Arrow Button Accent Effect */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#E9DFD4] text-[#29231F] transition-all duration-300 group-hover:bg-[#D9F99D] group-hover:border-[#D9F99D]">
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        );
      })}
    </section>
  );
}