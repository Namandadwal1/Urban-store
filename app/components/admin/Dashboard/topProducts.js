
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Tag } from "lucide-react";
import { createClient } from "@/lib///supabase/client";

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

      const cancelled = orders.data
        .filter((o) => ["cancelled", "canceled"].includes(o.status?.toLowerCase()))
        .map((o) => o.id);

      const sales = {};

      items.data
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
    <section className="rounded-2xl border border-[#E9DFD4] bg-[#F1EAE1] p-5">
      <p className="text-sm font-medium text-[#A56A43]">CUSTOMER FAVORITE</p>
      <h2 className="mt-1 text-lg font-bold text-[#29231F]">
        Best-Selling Product
      </h2>

      <div className="mt-5 rounded-2xl bg-white p-5 text-center">
        {loading ? (
          <p>Loading product...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !product ? (
          <p className="py-10 text-sm text-gray-500">
            No sales data available yet.
          </p>
        ) : (
          <>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-44 w-full rounded-xl bg-[#FAF7F2] object-contain"
              />
            ) : (
              <Tag size={48} className="mx-auto my-12 text-[#A56A43]" />
            )}

            <h3 className="mt-4 font-semibold">{product.name}</h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#FAF7F2] p-3">
                <p className="text-xs text-gray-500">Units Sold</p>
                <p className="mt-1 text-lg font-bold">{product.units}</p>
              </div>
              <div className="rounded-xl bg-[#FAF7F2] p-3">
                <p className="text-xs text-gray-500">Price</p>
                <p className="mt-1 text-lg font-bold">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <a href="/admin/products" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#29231F] px-4 py-3 text-sm text-white hover:bg-[#A56A43]">
        Manage Products <ArrowUpRight size={16} />
      </a>
    </section>
  );
}