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
    <section className="grid gap-4 sm:grid-cols-2">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.path}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#E9DFD4] bg-white p-5 transition hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#F5EFE8] p-3 text-[#A56A43]">
                <Icon size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-[#29231F]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>

            <ArrowUpRight size={19} className="shrink-0 text-[#A56A43]" />
          </Link>
        );
      })}
    </section>
  );
}