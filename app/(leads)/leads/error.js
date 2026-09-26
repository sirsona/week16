"use client";

export default function LeadsError({ error, reset }) {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-red-700 text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-600 mt-2">
        We couldn't load the leads. Please try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Try again
      </button>
    </main>
  );
}
