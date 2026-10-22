
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (!orderId || !razorpay_order_id ||
        !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Payment details are incomplete." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, payment_status, payment_method, razorpay_order_id")
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.payment_method !== "razorpay" ||
        order.razorpay_order_id !== razorpay_order_id) {
      return NextResponse.json(
        { error: "Payment does not match this order." },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("Razorpay secret is not configured.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${order.razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");

    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return NextResponse.json(
        { error: "Payment signature is invalid." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: secret,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== order.razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment is not captured yet. Please check again." },
        { status: 409 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id,
      })
      .eq("id", order.id)
      .eq("customer_id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment. Please check your order status." },
      { status: 500 }
    );
  }
}
