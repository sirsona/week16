"use server";

import pool from "@/lib/db";
import { redirect } from "next/navigation";

function parseOrder(formData) {
  const customerName = formData.get("name");
  const customerEmail = formData.get("email");
  const customerPhone = formData.get("phone");
  const customerAddress = formData.get("address");
  const paymentMethod = formData.get("paymentMethod");
  const itemsJson = formData.get("items");

  let items;
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid cart data" };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Cart is empty" };
  }

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !customerAddress ||
    !paymentMethod
  ) {
    return { error: "Missing required fields" };
  }

  const validItems = items.filter(
    (item) =>
      item &&
      typeof item.productId === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      typeof item.priceCents === "number" &&
      item.priceCents > 0,
  );

  if (validItems.length === 0) {
    return { error: "Cart contains no valid items" };
  }

  const total = validItems.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  return {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    paymentMethod,
    validItems,
    total,
  };
}

async function insertOrder(data) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    paymentMethod,
    validItems,
    total,
  } = data;

  const client = await pool.connect();
  let orderId;
  try {
    await client.query("BEGIN");
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_cents, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        total,
        paymentMethod,
      ],
    );
    orderId = orderResult.rows[0].id;

    for (const item of validItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_cents)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.priceCents],
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    return { error: err.message };
  } finally {
    client.release();
  }

  return { orderId, totalCents: total };
}

export async function createOrder(formData) {
  const parsed = parseOrder(formData);
  if (parsed.error) return { error: parsed.error };

  const result = await insertOrder(parsed);
  if (result.error) return { error: result.error };

  redirect(`/orders/${result.orderId}`);
}

export async function createOrderForPayment(formData) {
  const parsed = parseOrder(formData);
  if (parsed.error) return { error: parsed.error };

  const result = await insertOrder(parsed);
  if (result.error) return { error: result.error };

  return { orderId: result.orderId, totalCents: result.totalCents };
}
