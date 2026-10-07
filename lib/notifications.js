import pool from "@/lib/db";
import { sendTemplate, buildTemplateParams } from "@/lib/whatsapp";
import { withRetry } from "@/lib/retry";

// Send the WhatsApp order confirmation for a paid order.
// Best-effort: callers catch and log; never blocks or fails a payment.
export async function sendOrderConfirmation(orderId) {
  const { rows } = await pool.query(
    "SELECT id, total_cents, customer_name, customer_phone FROM orders WHERE id = $1",
    [orderId],
  );
  const order = rows[0];
  if (!order) return;

  const { rows: items } = await pool.query(
    `SELECT oi.quantity, p.name
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [order.id],
  );

  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "mctaba_shop";
  const params = buildTemplateParams(order, items);

  await withRetry(
    () => sendTemplate(order.customer_phone, templateName, params),
    { attempts: 3, baseDelayMs: 500 },
  );
}
