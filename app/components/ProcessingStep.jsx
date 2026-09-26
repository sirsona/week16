"use client";

import { useEffect } from "react";

export default function ProcessingStep({ onSuccess, onError }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 90% chance of success, 10% chance of error
      if (Math.random() > 0.1) {
        onSuccess(`order_${Date.now()}`);
      } else {
        onError("Payment failed. Please try again.");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [onSuccess, onError]);

  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-3">Processing...</h1>
      <p className="text-gray-600">Please wait while we confirm your order.</p>

      {/* Optional: Simple spinner */}
      <div className="mt-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
