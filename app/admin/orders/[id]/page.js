// app/admin/orders/[id]/page.js
import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateStatus } from "./updateStatus";

export const metadata = { title: "Order Details | Mctaba Shop Admin" };

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  // Fetch order
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  const order = rows[0];
  if (!order) notFound();

  // Fetch order items with product names
  const { rows: items } = await pool.query(
    `SELECT oi.*, p.name, p.image_url
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [id],
  );

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Order {order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600 mt-1">
            Placed on{" "}
            {new Date(order.created_at).toLocaleString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Status Update Form */}
        <div className="mb-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Update Status
          </h2>
          <form
            action={updateStatus.bind(null, order.id)}
            className="flex gap-4"
          >
            <select
              name="newStatus"
              defaultValue={order.status}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Update
            </button>
          </form>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × KSh{" "}
                    {(item.price_cents / 100).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  KSh{" "}
                  {((item.price_cents * item.quantity) / 100).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mb-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              KSh {(order.total_cents / 100).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Customer details
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Name:</span>{" "}
              {order.customer_name}
            </p>
            <p>
              <span className="font-medium text-gray-900">Email:</span>{" "}
              {order.customer_email}
            </p>
            <p>
              <span className="font-medium text-gray-900">Phone:</span>{" "}
              {order.customer_phone}
            </p>
            <p>
              <span className="font-medium text-gray-900">Address:</span>{" "}
              {order.customer_address}
            </p>
            <p>
              <span className="font-medium text-gray-900">Payment:</span>{" "}
              {order.payment_method || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
