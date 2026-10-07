"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reconcilePayment } from "./reconcile";

export default function ReconcileButton({ orderId }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const router = useRouter();

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await reconcilePayment(orderId);

      if (result.error) {
        setMessage(result.error);
      } else if (result.changed) {
        setMessage(
          `M-Pesa says: ${result.resultDesc} — order marked ${result.status}.`,
        );
      } else {
        setMessage(`M-Pesa says: ${result.resultDesc} — no change.`);
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Checking M-Pesa…" : "Check with M-Pesa"}
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
