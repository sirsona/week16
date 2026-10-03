// app/api/mpesa/callback/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { sendWhatsApp, buildConfirmationMessage } from "@/lib/whatsapp";

export async function POST(req) {
  let callback;
  try {
    const body = await req.json();
    callback = body.Body?.stkCallback;
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (!callback) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const checkoutId = callback.CheckoutRequestID;

  try {
    // Look up order
    const { rows } = await pool.query(
      "SELECT id, total_cents, status, customer_name, customer_phone FROM orders WHERE mpesa_checkout_id = $1",
      [checkoutId],
    );
    const order = rows[0];
    if (!order) {
      console.warn("Callback for unknown checkoutId:", checkoutId);
      return NextResponse.json({ status: "unknown" });
    }

    // Idempotency -- hand-typed
    if (order.status === "paid") {
      console.log("Duplicate callback:", checkoutId);
      return NextResponse.json({ status: "already processed" });
    }

    const resultCode = callback.ResultCode;
    if (resultCode === 0) {
      const metadata = callback.CallbackMetadata?.Item || [];
      const amountReceived = metadata.find((i) => i.Name === "Amount")?.Value;
      const receipt = metadata.find((i) => i.Name === "MpesaReceiptNumber")
        ?.Value;

      // Amount validation -- CRITICAL, hand-typed
      const expectedCents = order.total_cents;
      const receivedCents = Math.round(Number(amountReceived) * 100);
      if (receivedCents !== expectedCents) {
        console.error(
          `AMOUNT MISMATCH: expected ${expectedCents}, got ${receivedCents}`,
        );
        await pool.query(
          "UPDATE orders SET status = 'cancelled' WHERE id = $1",
          [order.id],
        );
        return NextResponse.json({ status: "mismatch" });
      }

      await pool.query(
        "UPDATE orders SET status = 'paid', mpesa_receipt = $1 WHERE id = $2",
        [receipt, order.id],
      );

      // Fetch the order items for the confirmation message.
      const { rows: items } = await pool.query(
        `SELECT oi.quantity, p.name
         FROM order_items oi JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [order.id],
      );

      // Trigger the WhatsApp confirmation -- hand-typed trigger point.
      // Best-effort: a failed send must not fail the callback or the payment.
      try {
        const text = buildConfirmationMessage(order, items);
        await sendWhatsApp(order.customer_phone, text);
      } catch (err) {
        console.error("Failed to send WhatsApp confirmation:", err);
      }
    } else {
      await pool.query(
        "UPDATE orders SET status = 'cancelled' WHERE id = $1",
        [order.id],
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("M-Pesa callback processing failed:", err);
    return NextResponse.json({ status: "error" });
  }
}
