"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import Script from "next/script";

const emptyAddress = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
};

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
      toast.success("Address saved!");
    }

    setSaving(false);
  }

  async function placeOrder() {
    if (saving || !product || !addressId || editing) return;

    if (paymentMethod === "razorpay" && !razorpayLoaded) {
      toast.error("Payment checkout is still loading. Please try again.");
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
        router.push("/user/orders");
        return;
      }

      const options = {
        key: result.keyId,
        amount: result.amount,
        currency: result.currency,
        name: "Men's Clothing Store",
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
                verifyResult.error || "Payment verification failed.",
              );
            }

            toast.success("Payment verified successfully!");
            router.push("/user/orders");
          } catch (error) {
            toast.error(
              error.message ||
                "Payment needs verification. Check your orders before retrying.",
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
          "Payment failed. Check your order status before trying again.",
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

  if (loading) return <p className="p-8">Loading checkout...</p>;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] p-8 text-[#29231F]">
        <h1 className="mb-3 text-2xl font-bold">Checkout</h1>
        <p className="mb-4">Please log in to continue.</p>
        <Link href="/login" className="text-[#A56A43] underline">
          Log In
        </Link>
      </main>
    );
  }

  if (!buyNowId || !product) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] p-8 text-[#29231F]">
        <h1 className="mb-3 text-2xl font-bold">Checkout</h1>
        <p className="mb-4">
          {!buyNowId
            ? "Please select a product using Buy Now."
            : "Product unavailable."}
        </p>
        <Link href="/" className="text-[#A56A43] underline">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <main className="min-h-screen bg-[#FAF7F2] p-5 text-[#29231F] md:p-10">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Your Product</h2>

            <div className="flex gap-4 rounded-xl border border-[#E9DFD4] bg-white p-4">
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                className="h-32 w-28 rounded-lg object-cover"
              />
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-[#7A7267]">
                  {product.category || "Men's Clothing"}
                </p>
                <p className="mt-2 font-semibold">₹{price.toFixed(2)}</p>
                <p className="mt-1 text-sm">Quantity: 1</p>
              </div>
            </div>

            <section className="mt-8 rounded-xl border border-[#E9DFD4] bg-white p-5">
              <div className="mb-4 flex justify-between">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                {addressId && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[#A56A43]"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={saveAddress} className="space-y-3">
                  {Object.entries({
                    full_name: "Full name",
                    phone: "Phone number",
                    address_line: "Street address",
                    city: "City",
                    state: "State",
                    postal_code: "Postal code",
                  }).map(([name, label]) => (
                    <input
                      key={name}
                      name={name}
                      value={address[name]}
                      onChange={changeAddress}
                      placeholder={label}
                      required
                      className="w-full rounded-lg border border-[#E9DFD4] bg-[#FAF7F2] p-3"
                    />
                  ))}

                  <button
                    disabled={saving}
                    className="w-full rounded-lg bg-[#A56A43] p-3 text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Address"}
                  </button>

                  {addressId && (
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-sm text-[#7A7267]"
                    >
                      Cancel
                    </button>
                  )}
                </form>
              ) : (
                <p className="leading-7">
                  {address.full_name}
                  <br />
                  {address.phone}
                  <br />
                  {address.address_line}, {address.city}, {address.state}{" "}
                  {address.postal_code}
                </p>
              )}
            </section>
          </section>

          <section className="h-fit rounded-xl border border-[#E9DFD4] bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <p className="flex justify-between border-b py-4">
              Product quantity <span>1</span>
            </p>
            <p className="flex justify-between py-4 text-lg font-bold">
              Total <span>₹{price.toFixed(2)}</span>
            </p>
            <div className="mb-5">
              <h3 className="mb-3 font-semibold">Payment Method</h3>

              <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-[#E9DFD4] p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E9DFD4] p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay Online with Razorpay</span>
              </label>
            </div>

            <button
              disabled={saving || product.stock < 1 || !addressId || editing}
              onClick={placeOrder}
              className="w-full rounded-lg bg-[#A56A43] p-3 text-white disabled:opacity-50"
            >
              {saving
                ? "Processing..."
                : paymentMethod === "cod"
                  ? "Place Order"
                  : "Pay Now"}
            </button>

            {product.stock < 1 && (
              <p className="mt-3 text-sm text-red-600">
                This product is out of stock.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<p className="p-8">Loading checkout...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}
