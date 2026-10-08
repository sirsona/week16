"use server";

import pool from "@/lib/db";
import { initiateCollection, formatPhone } from "@/lib/airtel";

export async function initiateAirtelPayment(orderId, phone, amountCents) {
  // Hand-typed validation rules.
  const normalized = formatPhone(phone);
  if (!normalized || !/^254(7|1)\d{8}$/.test(normalized)) {
    return { error: "Enter a valid Kenyan phone number (e.g. 0712345678)." };
  }

  if (!amountCents || amountCents < 100) {
    return {
      error: "Could not verify the order amount. Please contact support.",
    };
  }

  try {
    // Amount conversion (cents -> whole KSh) happens inside initiateCollection.
    const result = await initiateCollection({
      phone: normalized,
      amountCents,
      orderId,
    });

    await pool.query(
      "UPDATE orders SET airtel_reference = $1, status = 'initiated' WHERE id = $2",
      [result.referenceId, orderId],
    );

    return { referenceId: result.referenceId };
  } catch (err) {
    console.error(
      "Airtel collection error:",
      err.response?.data || err.message,
    );
    return { error: "Could not reach Airtel Money. Please try again." };
  }
}
