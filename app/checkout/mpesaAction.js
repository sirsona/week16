"use server";

import pool from "@/lib/db";
import { initiateStkPush } from "@/lib/mpesa";

// Normalise a Kenyan phone number to the international 254XXXXXXXXX format.
function normalizePhone(phone) {
  const digits = String(phone).trim().replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

export async function initiateMpesaPayment(orderId, phone, amountCents) {
  // 1. Hand-typed Validation Rules
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone || !/^254(7|1)\d{8}$/.test(normalizedPhone)) {
    return { error: "Enter a valid Kenyan phone number (e.g. 0712345678)." };
  }

  if (!amountCents || amountCents < 100) {
    return { error: "Could not verify the order amount. Please contact support." };
  }

  try {
    // 2. Hand-typed Money Conversion (Cents to KSh)
    const amountInKsh = Math.ceil(amountCents / 100);

    // 3. Trigger STK Push
    const result = await initiateStkPush({
      phone: normalizedPhone,
      amount: amountInKsh,
      accountRef: orderId.slice(0, 12),
      description: `Order ${orderId.slice(0, 8)}`,
    });

    if (!result.CheckoutRequestID) {
      return { error: "Could not reach M-Pesa. Please try again." };
    }

    // 4. Persist the checkout request id on the order record
    await pool.query(
      "UPDATE orders SET mpesa_checkout_id = $1, status = 'initiated' WHERE id = $2",
      [result.CheckoutRequestID, orderId],
    );

    return { checkoutRequestId: result.CheckoutRequestID };
  } catch (err) {
    console.error("M-Pesa STK Push Error:", err.response?.data || err.message);
    return { error: "Could not reach M-Pesa. Please try again." };
  }
}
