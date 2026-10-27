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
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "Active")
        .order("id", { ascending: false });

      if (error) toast.error("Failed to load products");
      else setProducts(data || []);

      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Handle Add to Cart logic
  async function handleAddToCart(item) {
    if (item.stock <= 0) return;
    setAddingId(item.id);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please log in to add items to your cart.");
      setAddingId(null);
      return;
    }

    // Check if product already exists in user's cart
    const { data: existing, error: fetchError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.id)
      .maybeSingle();

    if (fetchError) {
      toast.error(fetchError.message);
      setAddingId(null);
      return;
    }

    if (existing) {
      if (existing.quantity + 1 > item.stock) {
        toast.error("Not enough stock available.");
        setAddingId(null);
        return;
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success("Cart updated successfully!");
      }
    } else {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: item.id,
          quantity: 1,
        });

      if (insertError) {
        toast.error(insertError.message);
      } else {
        toast.success("Product added to cart!");
      }
    }

    setAddingId(null);
  }

  const filtered = products
    .filter((p) =>
      (category === "All" || p.category === category) &&
      (p.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      return Number(b.id) - Number(a.id);
    });

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#E9DFD4] pb-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
              <Shirt size={14} /> Store Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">Explore Collection</h1>
            <p className="text-sm text-neutral-600 mt-2">Discover your everyday style.</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 bg-[#29231F] text-white rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition hover:bg-neutral-800">
            <ShoppingBag size={16} /> View Shopping Cart
          </Link>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9DFD4] mb-8 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  category === cat 
                    ? "bg-[#D9F99D] text-[#29231F] shadow-sm" 
                    : "bg-[#FAF7F2] border border-[#E9DFD4] text-neutral-600 hover:text-[#29231F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." 
                className="w-full sm:w-60 pl-9 p-2.5 rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-sm outline-none focus:border-[#29231F]" 
              />
            </div>
            <div className="relative">
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full p-2.5 pr-8 rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-sm outline-none focus:border-[#29231F]"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal size={14} className="absolute right-3 top-3 pointer-events-none text-neutral-400" />
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-neutral-500 mb-4">Showing {filtered.length} items</p>

        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E9DFD4] p-8 max-w-md mx-auto shadow-sm">
            <Tag size={36} className="mx-auto mb-3 text-neutral-300" />
            <h2 className="font-bold text-lg">No products found</h2>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => { setCategory("All"); setSearch(""); }}
              className="mt-5 bg-[#D9F99D] px-5 py-2.5 rounded-xl text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => {
              const isAdding = addingId === item.id;
              const isOut = item.stock <= 0;

              return (
                <div key={item.id} className="rounded-2xl border border-[#E9DFD4] bg-white p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-56 object-cover rounded-xl border border-[#E9DFD4]" />
                    ) : (
                      <div className="h-56 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-xs text-neutral-400 border border-[#E9DFD4]">
                        No image available
                      </div>
                    )}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-3">{item.category}</span>
                    <h2 className="font-bold text-base mt-1 line-clamp-1">{item.name}</h2>
                    <p className="font-extrabold text-sm mt-1 text-[#29231F]">₹{Number(item.price).toFixed(2)}</p>
                    <p className={`text-xs font-semibold mt-1.5 ${!isOut ? "text-emerald-700" : "text-red-600"}`}>
                      {!isOut ? `In Stock (${item.stock})` : "Out of Stock"}
                    </p>
                  </div>

                  {/* Dual Action Buttons: Add to Cart & Buy Now */}
                  <div className="flex gap-2 mt-5">
                    <button
                      disabled={isOut || isAdding}
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#FAF7F2] border border-[#E9DFD4] text-[#29231F] hover:bg-[#F0EBE1] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isAdding ? "Adding..." : "Add to Cart"}
                    </button>

                    <Link 
                      href={`/checkout?buyNow=${item.id}`}
                      className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        !isOut 
                          ? "bg-[#D9F99D] text-[#29231F] hover:brightness-95" 
                          : "bg-neutral-100 text-neutral-400 pointer-events-none"
                      }`}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}