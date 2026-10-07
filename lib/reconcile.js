import pool from "@/lib/db";
import { queryStkStatus } from "@/lib/mpesa";

// Map Daraja's STK Query ResultCode to our order status.
// Hand-typed (money rule): only an authoritative ResultCode decides payment.
function mapResultCode(resultCode) {
  if (resultCode === "0") return "paid"; // success
  if (resultCode === "1032") return "cancelled"; // user cancelled
  if (resultCode === "1037") return "cancelled"; // prompt timed out
  if (resultCode === "2001") return "cancelled"; // insufficient funds
  if (resultCode === "4999") return null; // still processing -- leave as is
  return null; // unknown -- leave as is
}

// Reconcile one order against Daraja's STK Push Query API.
// Used by the admin "Check with M-Pesa" button and the checkout timeout backstop.
export async function reconcileOrder(orderId) {
  const { rows } = await pool.query(
    "SELECT id, status, mpesa_checkout_id FROM orders WHERE id = $1",
    [orderId],
  );
  const order = rows[0];
  if (!order) return { error: "Order not found" };
  if (!order.mpesa_checkout_id) return { error: "No STK push recorded" };
  if (order.status === "paid") {
    return { status: "paid", changed: false, note: "Already paid" };
  }

  let result;
  try {
    result = await queryStkStatus(order.mpesa_checkout_id);
  } catch (err) {
    const message =
      err.response?.data?.errorMessage ||
      err.response?.data?.ResultDesc ||
      err.message;
    return { error: `M-Pesa query failed: ${message || "unknown error"}` };
  }

  const newStatus = mapResultCode(String(result.ResultCode));
  if (newStatus && newStatus !== order.status) {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
      newStatus,
      order.id,
    ]);
  }

  return {
    status: newStatus || order.status,
    resultCode: result.ResultCode,
    resultDesc: result.ResultDesc,
    changed: Boolean(newStatus && newStatus !== order.status),
  };
}
