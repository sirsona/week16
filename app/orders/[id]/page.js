// app/orders/[id]/page.js
import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order ${id.slice(0, 8)} | Mctaba Shop`,
  };
}

export default async function OrderPage({ params }) {
  const { id } = await params;

  // Fetch the order
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
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order {order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Status */}
        <div className="mb-8">
          <span
            className={`inline-flex rounded-full px-4 py-1 text-sm font-medium ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : order.status === "fulfilled"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
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
        <div className="mb-8 bg-gray-50 rounded-xl p-6">
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 text-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            href="/my-orders"
            className="flex-1 text-center border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            View my orders
          </Link>
        </div>
      </div>
    </main>
  );
}
