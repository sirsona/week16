"use server";

import { reconcileOrder } from "@/lib/reconcile";
import { revalidatePath } from "next/cache";

export async function reconcilePayment(orderId) {
  const result = await reconcileOrder(orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");

  return result;
}
