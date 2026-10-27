"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import Script from "next/script";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Edit3, 
  Shirt, 
  Lock 
} from "lucide-react";

const emptyAddress = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
};

const inputStyle =
  "w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] p-3 text-xs sm:text-sm text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]";

function CheckoutContent() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [addressId, setAddressId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadCheckout();
  }, [buyNowId]);

  async function loadCheckout() {
    setLoading(true);
    setProduct(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (!user || !buyNowId) {
      setLoading(false);
      return;
    }

    const [{ data: saved, error: addressError }, { data: item, error }] =
      await Promise.all([
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .maybeSingle(),
        supabase
          .from("products")
          .select("id, name, price, image_url, stock, category")
          .eq("id", buyNowId)
          .eq("status", "Active")
          .maybeSingle(),
      ]);

    if (error) toast.error(error.message);
    else if (item) setProduct(item);
    else toast.error("Product is unavailable.");

    if (addressError) toast.error(addressError.message);

    if (saved) {
      setAddress({
        full_name: saved.full_name,
        phone: saved.phone,
        address_line: saved.address_line,
        city: saved.city,
        state: saved.state,
        postal_code: saved.postal_code,
      });
      setAddressId(saved.id);
      setEditing(false);
    } else {
      setAddress(emptyAddress);
      setAddressId(null);
      setEditing(true);
    }

    setLoading(false);
  }

  function changeAddress(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  async function saveAddress(e) {
    e.preventDefault();
    setSaving(true);

    const result = addressId
      ? await supabase
          .from("addresses")
          .update(address)
          .eq("id", addressId)
          .eq("user_id", user.id)
          .select()
          .single()
      : await supabase
          .from("addresses")
          .insert({
            ...address,
            user_id: user.id,
            is_default: true,
          })
          .select()
          .single();

    if (result.error) {
      toast.error(result.error.message);
    } else {
      setAddressId(result.data.id);
      setEditing(false);
      toast.success("Delivery address saved!");
    }

    setSaving(false);
  }

  async function placeOrder() {
    if (saving || !product || !addressId || editing) return;

    if (paymentMethod === "razorpay" && !razorpayLoaded) {
      toast.error("Payment checkout gateway is still loading. Please try again.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          addressId,
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not create order.");
      }

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        router.push("/orders");
        return;
      }

      const options = {
        key: result.keyId,
        amount: result.amount,
        currency: result.currency,
        name: "UrbanWear Apparel",
        description: product.name,
        order_id: result.razorpayOrderId,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: result.order.id,
                ...paymentResponse,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyResult.error || "Payment verification failed."
              );
            }

            toast.success("Payment verified successfully!");
            router.push("/orders");
          } catch (error) {
            toast.error(
              error.message ||
                "Payment needs verification. Check your orders before retrying."
            );
          }
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment window closed. Your order may remain pending.");
          },
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", function () {
        toast.error(
          "Payment failed. Check your order status before trying again."
        );
      });

      checkout.open();
    } catch (error) {
      toast.error(error.message || "Could not place order.");
    } finally {
      setSaving(false);
    }
  }

  const price = Number(product?.price || 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-[#29231F]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#29231F] border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Preparing your checkout...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-[#29231F] p-6">
        <div className="max-w-md w-full rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] mb-4">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#29231F]">Login Required</h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            Please log in to your account to complete checkout and manage delivery address.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#D9F99D] py-3.5 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95"
          >
            Log In to Continue
          </Link>
        </div>
      </main>
    );
  }

  if (!buyNowId || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-[#29231F] p-6">
        <div className="max-w-md w-full rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] border border-[#E9DFD4] text-neutral-400 mb-4">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#29231F]">No Item Selected</h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            {!buyNowId
              ? "Please select a product using 'Buy Now' or proceed through your cart."
              : "The selected item is currently unavailable."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95"
          >
            <ArrowLeft size={16} /> Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      <main className="relative min-h-screen bg-[#FAF7F2] text-[#29231F] px-4 py-8 sm:py-14 overflow-hidden">
        {/* Ambient Graphic Background Blurs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9DFD4] pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#cff281]">
                Secure Checkout
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
                Complete Your Order
              </h1>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#29231F] hover:underline decoration-[#D9F99D] decoration-2"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Column: Product & Delivery Address */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Preview Card */}
              <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#29231F] mb-4 flex items-center gap-2">
                  <Shirt size={18} /> Selected Product
                </h2>

                <div className="flex gap-4 rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4">
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E9DFD4] bg-white">
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {product.category || "Apparel"}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#29231F] truncate">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        Quantity: <span className="font-bold text-[#29231F]">1</span>
                      </p>
                    </div>

                    <p className="text-base font-extrabold text-[#29231F]">
                      ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-[#E9DFD4] pb-3">
                  <h2 className="text-base font-bold text-[#29231F] flex items-center gap-2">
                    <MapPin size={18} /> Delivery Address
                  </h2>
                  {addressId && !editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#29231F] hover:underline decoration-[#D9F99D]"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={saveAddress} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        name="full_name"
                        value={address.full_name}
                        onChange={changeAddress}
                        placeholder="Full Name"
                        required
                        className={inputStyle}
                      />
                      <input
                        name="phone"
                        value={address.phone}
                        onChange={changeAddress}
                        placeholder="Phone Number"
                        required
                        className={inputStyle}
                      />
                    </div>

                    <input
                      name="address_line"
                      value={address.address_line}
                      onChange={changeAddress}
                      placeholder="Street Address / House No."
                      required
                      className={inputStyle}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        name="city"
                        value={address.city}
                        onChange={changeAddress}
                        placeholder="City"
                        required
                        className={inputStyle}
                      />
                      <input
                        name="state"
                        value={address.state}
                        onChange={changeAddress}
                        placeholder="State"
                        required
                        className={inputStyle}
                      />
                      <input
                        name="postal_code"
                        value={address.postal_code}
                        onChange={changeAddress}
                        placeholder="Postal Code"
                        required
                        className={inputStyle}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-[#D9F99D] px-5 py-2.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Delivery Address"}
                      </button>

                      {addressId && (
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="rounded-xl border border-[#E9DFD4] bg-white px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    <p className="font-bold text-[#29231F] text-sm">{address.full_name}</p>
                    <p className="text-neutral-500">{address.phone}</p>
                    <p className="mt-1">
                      {address.address_line}, {address.city}, {address.state} -{" "}
                      <span className="font-semibold">{address.postal_code}</span>
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Payment Method */}
            <div className="lg:col-span-5 rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 shadow-sm sticky top-24 space-y-6">
              
              <h2 className="text-lg font-bold text-[#29231F] border-b border-[#E9DFD4] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-bold text-[#29231F]">
                    ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} /> Shipping
                  </span>
                  <span className="text-emerald-600 uppercase text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    Free Delivery
                  </span>
                </div>

                <div className="border-t border-[#E9DFD4] pt-3 flex justify-between text-base font-bold text-[#29231F]">
                  <span>Total Amount</span>
                  <span>₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#29231F] mb-3">
                  Select Payment Method
                </h3>

                <div className="space-y-2.5">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#29231F] bg-[#D9F99D]/30 ring-2 ring-[#D9F99D]"
                        : "border-[#E9DFD4] bg-[#FAF7F2] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 accent-[#29231F]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#29231F]">Cash on Delivery</p>
                        <p className="text-[11px] text-neutral-500">Pay when your package arrives</p>
                      </div>
                    </div>
                    <Truck size={18} className="text-neutral-500" />
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-[#29231F] bg-[#D9F99D]/30 ring-2 ring-[#D9F99D]"
                        : "border-[#E9DFD4] bg-[#FAF7F2] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 accent-[#29231F]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#29231F]">Razorpay Online Payment</p>
                        <p className="text-[11px] text-neutral-500">UPI, Cards, NetBanking, Wallets</p>
                      </div>
                    </div>
                    <CreditCard size={18} className="text-neutral-500" />
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={saving || product.stock < 1 || !addressId || editing}
                onClick={placeOrder}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3.5 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Processing Order..."
                  : paymentMethod === "cod"
                  ? "Confirm & Place Order"
                  : "Pay Now via Razorpay"}
              </button>

              {product.stock < 1 && (
                <p className="text-center text-xs font-bold text-red-600">
                  This product is currently out of stock.
                </p>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-neutral-500 pt-2 border-t border-[#E9DFD4]">
                <ShieldCheck size={14} className="text-emerald-600" />
                Guaranteed safe & encrypted checkout
              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-[#29231F]">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Loading checkout...
          </p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}