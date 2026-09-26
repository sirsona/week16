"use client";

export default function ErrorStep({ error, onReset }) {
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold text-red-600 mb-3">❌ Error</h1>
      <p className="mb-6">{error}</p>
      <button
        onClick={onReset}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
