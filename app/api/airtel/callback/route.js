// app/api/airtel/callback/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/notifications";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const txn = body?.transaction;
  if (!txn) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const referenceId = txn.id;
  console.log("Airtel callback received:", {
    referenceId,
    statusCode: txn.status_code,
    amount: txn.amount,
  });

  try {
    // Look up the order by the reference we generated at initiate time.
    const { rows } = await pool.query(
      "SELECT id, total_cents, status FROM orders WHERE airtel_reference = $1",
      [referenceId],
    );
    const order = rows[0];
    if (!order) {
      console.warn("Airtel callback for unknown reference:", referenceId);
      return NextResponse.json({ status: "unknown" });
    }

    // Idempotency -- hand-typed.
    if (order.status === "paid") {
      console.log("Duplicate Airtel callback:", referenceId);
      return NextResponse.json({ status: "already processed" });
    }

    if (txn.status_code === "TS") {
      // Amount validation -- CRITICAL, hand-typed (whole KSh on Airtel).
      const expectedKsh = Math.ceil(order.total_cents / 100);
      const receivedKsh = Number(txn.amount);
      if (txn.amount !== undefined && receivedKsh !== expectedKsh) {
        console.error(
          `AIRTEL AMOUNT MISMATCH: expected ${expectedKsh}, got ${receivedKsh}`,
        );
        await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [
          order.id,
        ]);
        return NextResponse.json({ status: "mismatch" });
      }

      await pool.query(
        "UPDATE orders SET status = 'paid', airtel_transaction_id = $1 WHERE id = $2",
        [txn.airtel_money_id || null, order.id],
      );

      try {
        await sendOrderConfirmation(order.id);
      } catch (err) {
        console.error("Failed to send WhatsApp confirmation:", err);
      }
    } else if (txn.status_code === "TF") {
      await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [
        order.id,
      ]);
    }
    // TIP (transaction in progress) -> leave as initiated; Airtel calls again.

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Airtel callback processing failed:", err);
    return NextResponse.json({ status: "error" });
  }
}
