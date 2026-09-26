"use client";

export default function AwaitPayment({ checkoutRequestId }) {
  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-3">M-Pesa payment initiated</h1>
      <p className="text-gray-600">
        Check your phone for the M-Pesa prompt and enter your PIN to complete
        the payment.
      </p>

      {checkoutRequestId && (
        <p className="mt-6 text-xs text-gray-400 font-mono break-all">
          Checkout Request ID: {checkoutRequestId}
        </p>
      )}
    </div>
  );
}
