// app/admin/orders/page.js
import pool from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Admin Orders | Mctaba Shop" };
export default async function AdminOrdersPage({ searchParams }) {
  const { status = "all", offset: offsetParam = "0" } = await searchParams;
  const limit = 20;
  const offset = parseInt(offsetParam, 10) || 0;

  let sql =
    "SELECT id, customer_name, total_cents, status, created_at FROM orders";
  const params = [];
  if (status !== "all") {
    params.push(status);
    sql += ` WHERE status = $${params.length}`;
  }
  sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const { rows: orders } = await pool.query(sql, params);

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

        {/* Filter Links */}
        <div className="mb-6 flex gap-2">
          {["all", "pending", "paid", "fulfilled", "cancelled"].map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                status === s
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>

        {/* Orders Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Total
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    KSh {(order.total_cents / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "fulfilled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex gap-4">
          {offset > 0 && (
            <Link
              href={`/admin/orders?status=${status}&offset=${Math.max(0, offset - limit)}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← Previous
            </Link>
          )}
          {orders.length === limit && (
            <Link
              href={`/admin/orders?status=${status}&offset=${offset + limit}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
