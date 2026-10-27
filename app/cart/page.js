"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Shirt, 
  Scissors, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from "lucide-react";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const supabase = createClient();

  const getCart = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, products(id, name, price, image_url, stock)")
      .eq("user_id", user.id);

    if (error) toast.error(error.message);
    else setItems(data || []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  async function updateQuantity(item, quantity) {
    if (quantity < 1) return;
    if (quantity > item.products.stock) {
      return toast.error("Not enough stock available.");
    }

    setUpdatingId(item.id);
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", item.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Cart updated");
      await getCart();
    }
    setUpdatingId(null);
  }

  async function removeItem(id) {
    setUpdatingId(id);
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (error) toast.error(error.message);
    else {
      toast.success("Product removed from cart");
      await getCart();
    }
    setUpdatingId(null);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products?.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shipping;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-[#29231F]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#29231F] border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Loading your cart...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-8 sm:py-14 overflow-hidden">
      
      {/* Background Floating Ambient Graphic Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      {/* Floating Graphic Background Decorators */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-12 right-12 text-[#29231F] rotate-12">
          <Shirt size={140} strokeWidth={1} />
        </div>
        <div className="absolute bottom-16 left-12 text-[#29231F] -rotate-12">
          <ShoppingBag size={150} strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-[#29231F] rotate-45 hidden md:block">
          <Scissors size={80} strokeWidth={1} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9DFD4] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#cff281]">
                Shopping Bag
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
              Your Cart
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#29231F] hover:underline decoration-[#D9F99D] decoration-2"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Not Logged In State */}
        {!user ? (
          <div className="mx-auto max-w-md rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#29231F]">Please Log In</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              Sign in to view your saved cart items and complete your order.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3 text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
            >
              Log In to Shop <ArrowRight size={16} />
            </Link>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="mx-auto max-w-md rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] border border-[#E9DFD4] text-neutral-400 mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#29231F]">Your cart is empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] px-6 py-3 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Cart Grid View */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => {
                const product = item.products || {};
                const isUpdating = updatingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 shadow-sm transition-all hover:border-[#D9F99D] ${
                      isUpdating ? "opacity-60" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#E9DFD4]">
                      <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name || "Product"}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-sm sm:text-base text-[#29231F] truncate">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-xs font-semibold text-neutral-500">
                        ₹{Number(product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>

                      {/* Quantity Controls */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] p-1">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#29231F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            disabled={item.quantity >= product.stock || isUpdating}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline transition"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Item Total Price */}
                    <div className="self-end sm:self-center text-right">
                      <p className="text-xs text-neutral-400 hidden sm:block">Total</p>
                      <p className="text-sm sm:text-base font-bold text-[#29231F]">
                        ₹{(Number(product.price || 0) * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-[#29231F] mb-4">Order Summary</h2>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#29231F]">
                    ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} /> Estimated Shipping
                  </span>
                  <span className="font-bold text-[#29231F]">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 uppercase text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[11px] text-neutral-400">
                    Add ₹{(2000 - subtotal).toFixed(2)} more for free delivery.
                  </p>
                )}

                <div className="border-t border-[#E9DFD4] pt-3 flex justify-between text-base font-bold text-[#29231F]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => toast.info("Checkout module integration is coming next!")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3.5 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-neutral-500">
                <ShieldCheck size={14} className="text-emerald-600" />
                Guaranteed safe & secure checkout
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}