"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "Active")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        setError("Unable to load products. Please try again later.");
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    getProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-10 text-center text-[#29231F]">
        Loading products...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-10 text-center text-red-700">
        {error}
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full py-10 text-center text-[#7A7267]">
        No products are available right now.
      </section>
    );
  }

  return (
    <section className="w-full py-6">
      <div className="flex justify-between items-end mb-6">
        <p className="text-xs text-[#7A7267] font-medium">
          Showing {products.length} Items
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="group bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-[#E9DFD4] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 bg-[#F5F2ED] rounded-xl overflow-hidden mb-4 border border-[#E9DFD4]">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#8C8275]">
                    No image available
                  </div>
                )}

                <span className="absolute top-2.5 left-2.5 text-[10px] font-medium bg-white/90 px-2 py-1 rounded-full text-[#29231F] border border-[#E9DFD4]">
                  {item.category}
                </span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-[#29231F] leading-snug group-hover:text-[#A56A43] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#8C8275] mt-1">
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                <p className="text-sm font-bold text-[#29231F] bg-[#F5F2ED] px-2 py-1 rounded-md border border-[#E9DFD4]">
                  ₹{Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                disabled={item.stock <= 0 || adding === item.id}
                onClick={async () => {
                  setAdding(item.id);

                  const supabase = createClient();
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();

                  if (!user) {
                    toast.error("Please log in to add products to your cart.");
                    setAdding("");
                    return;
                  }

                  const { data: cartItem } = await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", user.id)
                    .eq("product_id", item.id)
                    .maybeSingle();

                  const result = cartItem
                    ? await supabase
                        .from("cart_items")
                        .update({ quantity: cartItem.quantity + 1 })
                        .eq("id", cartItem.id)
                    : await supabase.from("cart_items").insert({
                        user_id: user.id,
                        product_id: item.id,
                        quantity: 1,
                      });

                  if (result.error) {
                    toast.error(result.error.message);
                  } else {
                    toast.success("Product added to cart!");
                  }

                  setAdding("");
                }}
                className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-[#F5F2ED] text-[#29231F] hover:bg-[#EAE4DC] border border-[#E9DFD4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding === item.id ? "Adding..." : "Add to Cart"}
              </button>

              <button
                disabled={item.stock <= 0}
                onClick={async () => {
                  const supabase = createClient();
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();

                  if (!user) {
                    toast.error("Please log in before purchasing.");
                    router.push("/login");
                    return;
                  }

                  const { data: existing, error } = await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", user.id)
                    .eq("product_id", item.id)
                    .maybeSingle();

                  if (error) return toast.error(error.message);

                  if (existing) {
                    if (existing.quantity + 1 > item.stock) {
                      return toast.error("Not enough stock available.");
                    }

                    const { error } = await supabase
                      .from("cart_items")
                      .update({ quantity: existing.quantity + 1 })
                      .eq("id", existing.id);

                    if (error) return toast.error(error.message);
                  } else {
                    const { error } = await supabase.from("cart_items").insert({
                      user_id: user.id,
                      product_id: item.id,
                      quantity: 1,
                    });

                    if (error) return toast.error(error.message);
                  }

                  router.push(`/checkout?buyNow=${item.id}`);
                }}
                className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-[#A56A43] text-white hover:bg-[#8F5836] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Product;
