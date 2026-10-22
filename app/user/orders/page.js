"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setOrders(data || []);

      if (data?.length) {
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", data.map((order) => order.id));

        if (itemsError) setError(itemsError.message);
        else setItems(orderItems || []);
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) {
    return <p className="p-8 text-[#29231F]">Loading your orders...</p>;
  }

  return (
    <main className="min-h-screen bg-[#FCFBF4] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-[#29231F]">My Orders</h1>
        <p className="mt-2 text-sm text-gray-600">
          View your purchases and track your deliveries.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {!orders.length && !error && (
          <div className="mt-8 rounded-xl border border-[#E9DFD4] bg-white p-8 text-center">
            <Package size={40} className="mx-auto text-[#A56A43]" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your purchases will appear here.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-block rounded-lg bg-[#A56A43] px-5 py-3 text-white"
            >
              Explore Products
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const address = order.shipping_address;
            const orderItems = items.filter(
              (item) => item.order_id === order.id
            );

            return (
              <section
                key={order.id}
                className="rounded-xl border border-[#E9DFD4] bg-white p-5 md:p-6"
              >
                <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                  <div>
                    <p className="font-semibold text-[#29231F]">
                      Order #{order.order_number ?? order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-[#F5EBDD] px-3 py-1 text-sm font-medium capitalize text-[#875333]">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4 py-5">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[#29231F]">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-gray-500">
                          Qty: {item.quantity}
                          {item.size ? ` · Size: ${item.size}` : ""}
                        </p>
                      </div>
                      <p className="font-medium whitespace-nowrap">
                        ₹{Number(item.unit_price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Payment</span>
                    <span className="capitalize">{order.payment_status}</span>
                  </div>

                  <div className="flex justify-between gap-3 font-semibold">
                    <span>Total Amount</span>
                    <span>₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {address && (
                  <div className="mt-5 rounded-lg bg-[#FAF7F2] p-4 text-sm">
                    <h3 className="mb-2 font-semibold">Delivery Address</h3>
                    {typeof address === "object" ? (
                      <>
                        <p>{address.full_name}</p>
                        <p>{address.phone}</p>
                        <p>
                          {address.address_line}, {address.city},{" "}
                          {address.state} - {address.postal_code}
                        </p>
                      </>
                    ) : (
                      <p>{address}</p>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}