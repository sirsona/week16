import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-white">
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-5xl">
          📚
        </div>

        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Product not found
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          The book you’re looking for may have been removed, renamed, or is no
          longer available in our catalogue.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Browse all books
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Return home
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 border-t border-gray-100 pt-10 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-5">
            <div className="text-2xl">📖</div>
            <p className="mt-2 font-medium text-gray-900">New arrivals</p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-5">
            <div className="text-2xl">⭐</div>
            <p className="mt-2 font-medium text-gray-900">Bestsellers</p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-5">
            <div className="text-2xl">🚚</div>
            <p className="mt-2 font-medium text-gray-900">Fast delivery</p>
          </div>
        </div>
      </div>
    </main>
  );
}
