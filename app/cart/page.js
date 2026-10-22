"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function getCart() {
    const { data: { user } } = await supabase.auth.getUser();
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
  }

  useEffect(() => {
    getCart();
  }, []);

  async function updateQuantity(item, quantity) {
    if (quantity < 1) return;
    if (quantity > item.products.stock) {
      return toast.error("Not enough stock available.");
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", item.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Cart updated");
      getCart();
    }
  }

  async function removeItem(id) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (error) toast.error(error.message);
    else {
      toast.success("Product removed from cart");
      getCart();
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products.price) * item.quantity, 0
  );

  if (loading) return <p className="p-8">Loading your cart...</p>;

  return (
    <main className="min-h-screen bg-[#FAF7F2] p-6 text-[#29231F] md:p-10">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {!user ? (
        <div>
          <p className="mb-4">Please log in to view your cart and shop.</p>
          <Link href="/login" className="rounded-lg bg-[#A56A43] px-5 py-3 text-white">
            Log In to Shop
          </Link>
        </div>
      ) : items.length === 0 ? (
        <div>
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/" className="text-[#A56A43] underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl border border-[#E9DFD4] bg-white p-4">
              <img
                src={item.products.image_url || "/placeholder.png"}
                alt={item.products.name}
                className="h-24 w-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.products.name}</h2>
                <p>₹{Number(item.products.price).toFixed(2)}</p>

                <div className="mt-3 flex items-center gap-3">
                  <button onClick={() => updateQuantity(item, item.quantity - 1)} className="rounded border px-3">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} disabled={item.quantity >= item.products.stock} className="rounded border px-3 disabled:opacity-40">+</button>
                  <button onClick={() => removeItem(item.id)} className="ml-2 text-sm text-red-600">Remove</button>
                </div>
              </div>

              <p className="font-semibold">
                ₹{(Number(item.products.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="border-t border-[#E9DFD4] pt-5 text-right">
            <p className="mb-4 text-xl font-bold">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <button
              onClick={() => toast.info("Checkout is coming soon.")}
              className="rounded-lg bg-[#A56A43] px-6 py-3 text-white"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}