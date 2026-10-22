
import { createClient } from "@/lib///supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  const supabase = await createClient();
  let orderId = null;

  try {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const { productId, addressId, paymentMethod } =
      await request.json();

    if (!productId || !addressId ||
        !["cod", "razorpay"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid product, address, or payment method." },
        { status: 400 }
      );
    }

    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single();

    if (addressError || !address) {
      return NextResponse.json(
        { error: "Please select a valid delivery address." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price, stock, status")
      .eq("id", productId)
      .eq("status", "Active")
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product is unavailable." },
        { status: 404 }
      );
    }

    if (product.stock < 1) {
      return NextResponse.json(
        { error: "This product is out of stock." },
        { status: 400 }
      );
    }

    const price = Number(product.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Invalid product price." },
        { status: 400 }
      );
    }

    // Create our store order first.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        total_amount: price,
        shipping_address: address,
        status: "pending",
        payment_status: "pending",
        payment_method: paymentMethod,
      })
      .select("id, order_number")
      .single();

    if (orderError) throw orderError;
    orderId = order.id;

    const { error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: price,
      });

    if (itemError) throw itemError;

    // COD orders don't need a Razorpay payment order.
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        paymentMethod: "cod",
        order,
      });
    }

    if (!process.env.RAZORPAY_KEY_ID ||
        !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys are not configured.");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(price * 100),
      currency: "INR",
      receipt: String(order.order_number),
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ razorpay_order_id: paymentOrder.id })
      .eq("id", order.id)
      .eq("customer_id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      paymentMethod: "razorpay",
      order,
      razorpayOrderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Place order error:", error);

    // Clean up the incomplete store order if creation failed.
    if (orderId) {
      await supabase.from("order_items").delete().eq("order_id", orderId);
      await supabase.from("orders").delete()
        .eq("id", orderId);
    }

    return NextResponse.json(
      { error: "Unable to create your order. Please try again." },
      { status: 500 }
    );
  }
}
