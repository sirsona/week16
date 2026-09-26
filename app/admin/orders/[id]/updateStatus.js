"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

const ALLOWED_STATUSES = ["pending", "paid", "fulfilled", "cancelled"];

export async function updateStatus(orderId, formData) {
  const newStatus = formData.get("newStatus");

  if (!ALLOWED_STATUSES.includes(newStatus)) {
    return { error: "Invalid status" };
  }

  await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
    newStatus,
    orderId,
  ]);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}
