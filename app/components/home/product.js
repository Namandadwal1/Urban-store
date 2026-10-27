"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  Shirt, 
  SlidersHorizontal 
} from "lucide-react";

const categories = ["All", "Shirts", "T-Shirts", "Trousers", "Jackets"];

export default function CustomerProductsPage() {
  const [supabase] = useState(() => createClient());
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState("");
  const router = useRouter();

  // Fetch product catalog from Supabase
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "Active")
        .order("id", { ascending: false });

      if (error) {
        toast.error("Failed to load products");
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchCatalog();
  }, [supabase]);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = (p.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return b.id - a.id; // newest
    });

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-8 sm:py-14 overflow-hidden">
      
      {/* Background Floating Ambient Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-[#E9DFD4] pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-3 py-1 rounded-full border border-[#cff281] shadow-sm mb-2">
              <Shirt size={12} /> Store Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#29231F]">
              Explore Collection
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-lg">
              Discover contemporary streetwear and minimalist everyday apparel crafted for ultimate comfort.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29231F] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 self-center sm:self-auto"
          >
            <ShoppingBag size={16} /> View Shopping Cart
          </Link>
        </div>

        {/* Category & Search Toolbar */}
        <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:p-5 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#D9F99D] text-[#29231F] shadow-sm scale-105"
                      : "bg-[#FAF7F2] text-neutral-600 border border-[#E9DFD4] hover:bg-white hover:text-[#29231F]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-9 pr-3 text-xs text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-3.5 pr-8 text-xs font-bold text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Counter */}
        <div className="mb-4 text-xs font-bold text-[#7A7267]">
          Showing {filteredProducts.length} Items
        </div>

        {/* Product Grid Area */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#E9DFD4] bg-white/80 p-4 animate-pulse shadow-sm">
                <div className="h-56 w-full rounded-2xl bg-neutral-200 mb-4" />
                <div className="h-4 w-2/3 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-1/3 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-8 shadow-sm max-w-md mx-auto">
            <Tag size={40} className="mx-auto mb-3 text-neutral-300" />
            <h3 className="text-lg font-bold text-[#29231F]">No products found</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-5 rounded-xl bg-[#D9F99D] px-5 py-2.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white/60 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-[#E9DFD4] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 sm:h-52 md:h-64 bg-[#F5F2ED] rounded-xl overflow-hidden mb-3 md:mb-4 border border-[#E9DFD4]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm text-[#8C8275] p-2 text-center">
                        No image available
                      </div>
                    )}

                    <span className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-medium bg-white/90 px-2 py-0.5 sm:py-1 rounded-full text-[#29231F] border border-[#E9DFD4]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
                    <div className="w-full">
                      <h3 className="font-semibold text-xs sm:text-sm text-[#29231F] leading-snug line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[10px] sm:text-xs text-[#8C8275]">
                          {item.stock > 0 ? "In Stock" : "Out of Stock"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <span className="text-[10px] text-[#8C8275] mr-0.5">Sizes:</span>
                        {(item.sizes || ["S", "M", "L", "XL"]).map((size, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-medium bg-[#F5F2ED] border border-[#E9DFD4] px-1.5 py-0.5 rounded text-[#29231F]"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-[#29231F] bg-[#F5F2ED] px-2 py-0.5 sm:py-1 rounded-md border border-[#E9DFD4] whitespace-nowrap mt-1 sm:mt-0">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    disabled={item.stock <= 0 || adding === item.id}
                    onClick={async () => {
                      setAdding(item.id);

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
                    className="flex-1 py-2 text-[11px] sm:text-xs font-semibold rounded-lg bg-[#F5F2ED] text-[#29231F] hover:bg-[#EAE4DC] border border-[#E9DFD4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding === item.id ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    disabled={item.stock <= 0}
                    onClick={async () => {
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
                    className="flex-1 py-2 text-[11px] sm:text-xs font-semibold rounded-lg bg-[#D9F99D] text-[#29231F] hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}