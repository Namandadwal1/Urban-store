"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Tag, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TopProducts() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient();

      const [orders, items] = await Promise.all([
        supabase.from("orders").select("id, status"),
        supabase.from("order_items").select("order_id, product_id, product_name, quantity"),
      ]);

      if (orders.error || items.error) {
        setError(orders.error?.message || items.error?.message);
        setLoading(false);
        return;
      }

      const cancelled = (orders.data || [])
        .filter((o) => ["cancelled", "canceled"].includes(o.status?.toLowerCase()))
        .map((o) => o.id);

      const sales = {};

      (items.data || [])
        .filter((item) => !cancelled.includes(item.order_id))
        .forEach((item) => {
          const id = item.product_id;
          if (!id) return;

          if (!sales[id]) {
            sales[id] = { id, name: item.product_name, units: 0 };
          }

          sales[id].units += Number(item.quantity || 0);
        });

      const best = Object.values(sales).sort((a, b) => b.units - a.units)[0];

      if (best) {
        const { data, error } = await supabase
          .from("products")
          .select("name, price, image_url")
          .eq("id", best.id)
          .single();

        if (error) setError(error.message);
        else setProduct({ ...best, ...data });
      }

      setLoading(false);
    }

    fetchProduct();
  }, []);

  return (
    <section className="rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#d1f58b] shadow-sm">
            <Trophy size={12} /> Customer Favorite
          </span>
          <span className="text-[11px] font-medium text-neutral-400">Best Seller</span>
        </div>

        <h2 className="mt-2 text-base sm:text-lg font-bold text-[#29231F]">
          Top Performing Product
        </h2>

        {/* Product Showcase Card */}
        <div className="mt-4 rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 text-center shadow-inner">
          {loading ? (
            <div className="py-12 text-xs text-neutral-500 flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
              Loading best-seller...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              {error}
            </div>
          ) : !product ? (
            <div className="py-10 text-center text-xs text-neutral-400">
              <Tag size={32} className="mx-auto mb-2 text-neutral-300" />
              No sales data available yet.
            </div>
          ) : (
            <>
              {/* Product Image */}
              <div className="relative h-40 sm:h-44 w-full rounded-xl bg-white border border-[#E9DFD4] overflow-hidden mb-4 shadow-sm">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-neutral-400">
                    <Tag size={36} />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#29231F] line-clamp-1">
                {product.name}
              </h3>

              {/* Stats Breakdown */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3 border border-[#E9DFD4] shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Units Sold
                  </p>
                  <p className="mt-1 text-base sm:text-lg font-bold text-[#29231F]">
                    {product.units}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-[#E9DFD4] shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Price
                  </p>
                  <p className="mt-1 text-base sm:text-lg font-bold text-[#29231F]">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manage Products Link */}
      <Link
        href="/admin/products"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#29231F] px-4 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-sm"
      >
        Manage Products <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}