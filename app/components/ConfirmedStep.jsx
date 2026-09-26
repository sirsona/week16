"use client";

import Link from "next/link";

export default function ConfirmedStep({ orderId }) {
  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-3">
        Order confirmed!
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Order ID: <span className="font-mono font-semibold">{orderId}</span>
      </p>

      <Link
        href={`/orders/${orderId}`}
        className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        View order details
      </Link>

      <div className="mt-4">
        <Link
          href="/products"
          className="text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
