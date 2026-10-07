"use client";

import { useEffect } from "react";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000;

export default function AwaitPayment({
  orderId,
  checkoutRequestId,
  onPaid,
  onFailed,
}) {
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === "paid") {
          clearInterval(interval);
          onPaid(orderId);
        } else if (data.status === "cancelled") {
          clearInterval(interval);
          onFailed(
            "Payment amount does not match the order. Please contact support.",
          );
        }
      } catch {
        // Transient network error -- keep polling.
      }
    }, POLL_INTERVAL_MS);

    const timeout = setTimeout(async () => {
      clearInterval(interval);

      // Callbacks can be slow or lost. Before failing, ask Daraja directly
      // (one-shot reconciliation) so a completed payment still succeeds.
      try {
        const res = await fetch(`/api/orders/${orderId}/reconcile`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === "paid") {
            onPaid(orderId);
            return;
          }
        }
      } catch {
        // fall through to the timeout message
      }

      onFailed(
        "No response from M-Pesa after 2 minutes. Check your phone or try again.",
      );
    }, POLL_TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, onPaid, onFailed]);

  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-3">M-Pesa payment initiated</h1>
      <p className="text-gray-600">
        Check your phone for the M-Pesa prompt and enter your PIN to complete
        the payment.
      </p>

      <div className="mt-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>

      {checkoutRequestId && (
        <p className="mt-6 text-xs text-gray-400 font-mono break-all">
          Checkout Request ID: {checkoutRequestId}
        </p>
      )}
    </div>
  );
}
