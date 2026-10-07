// app/api/webhooks/stripe/route.js
import { stripe } from "@/lib/stripe";
import pool from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/notifications";

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  // Signature verification -- hand-typed (money rule). Never trust an
  // unsigned webhook: anyone could POST a fake "paid" event.
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Invalid Stripe signature:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency -- hand-typed: one row per Stripe event.id.
  const { rows: seen } = await pool.query(
    "SELECT 1 FROM webhook_events WHERE id = $1",
    [event.id],
  );
  if (seen.length > 0) {
    console.log("Duplicate Stripe event:", event.id);
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;
        if (orderId) {
          await pool.query(
            "UPDATE orders SET status = 'paid' WHERE id = $1 AND payment_method = 'stripe'",
            [orderId],
          );
          try {
            await sendOrderConfirmation(orderId);
          } catch (err) {
            console.error("Failed to send WhatsApp confirmation:", err);
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;
        if (orderId) {
          await pool.query(
            "UPDATE orders SET status = 'cancelled' WHERE id = $1 AND payment_method = 'stripe'",
            [orderId],
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        console.log("Stripe payment failed:", event.data.object.id);
        break;
      }

      default:
        // Ignore unhandled event types.
        break;
    }

    await pool.query(
      "INSERT INTO webhook_events (id) VALUES ($1) ON CONFLICT DO NOTHING",
      [event.id],
    );

    return Response.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err);
    return Response.json({ error: "Processing failed" }, { status: 500 });
  }
}
