"use server";

import { stripe } from "@/lib/stripe";
import pool from "@/lib/db";

export async function createStripeCheckoutSession(orderId) {
  // Amount is read from the server-stored order, never from the client.
  const { rows } = await pool.query(
    "SELECT total_cents, customer_email FROM orders WHERE id = $1",
    [orderId],
  );
  const order = rows[0];
  if (!order) return { error: "Order not found" };

  try {
    // Note: `payment_method_types` is no longer accepted by the Checkout
    // Sessions API -- payment methods are configured in the Stripe dashboard
    // (dynamic payment methods). Card is enabled by default in test mode.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "kes",
            product_data: { name: `Order ${orderId.slice(0, 8)}` },
            unit_amount: order.total_cents,
          },
          quantity: 1,
        },
      ],
      customer_email: order.customer_email || undefined,
      success_url: `${process.env.APP_URL}/orders/${orderId}?stripe_success=1`,
      cancel_url: `${process.env.APP_URL}/checkout?cancelled=1`,
      metadata: { order_id: orderId },
    });

    await pool.query(
      "UPDATE orders SET stripe_session_id = $1, status = 'initiated' WHERE id = $2",
      [session.id, orderId],
    );

    return { url: session.url };
  } catch (err) {
    console.error("Stripe checkout session error:", err.message);
    return { error: "Could not start card payment. Please try again." };
  }
}
