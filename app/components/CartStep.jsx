"use client";

export default function CartStep({ onNext }) {
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Your cart</h1>
      <p className="text-gray-600 mb-6">You have items in your cart.</p>
      <button
        onClick={onNext}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
