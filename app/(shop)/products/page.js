// app/(shop)/products/page.js
import pool from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "All Books | Mctaba Shop",
  description: "Browse our collection of quality books",
  openGraph: {
    title: "All Books | Mctaba Shop",
    description: "Browse our collection of quality books",
    type: "website",
  },
};

export default async function ProductsPage() {
  let products = [];
  let error = null;

  try {
    const { rows } = await pool.query(
      `SELECT id, slug, name, price_cents, image_url, in_stock, category
       FROM products
       ORDER BY created_at DESC`,
    );
    products = rows;
  } catch (err) {
    console.warn("Could not fetch products — showing empty state");
    error = "We're having trouble loading books. Please try again later.";
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-linear-to-b from-indigo-50/50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Book catalogue
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Explore our collection
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Discover programming, business, finance, and personal development
            books carefully selected for ambitious readers.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white">
              All Books
            </button>
            <button className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Programming
            </button>
            <button className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Business
            </button>
            <button className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Finance
            </button>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {products.length} books available
            </h2>
            <p className="text-gray-600">
              Updated daily with new arrivals and bestsellers.
            </p>
          </div>

          <select className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
            <option>Newest first</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Selling</option>
          </select>
        </div>

        {error ? (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 py-20 text-center">
            <div className="text-5xl">📚</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load books
            </h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-gray-900 px-5 py-3 text-white hover:bg-gray-800"
            >
              Return Home
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 py-20 text-center">
            <div className="text-5xl">📖</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No books available
            </h3>
            <p className="mt-2 text-gray-600">
              We&apos;re updating our catalogue. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    priority
                  />
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                    Bestseller
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700">
                    {p.name}
                  </h3>

                  <p className="mt-3 text-xl font-bold text-gray-900">
                    KSh {(p.price_cents / 100).toLocaleString()}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Free delivery</span>

                    <span className="text-sm font-medium text-indigo-600 transition group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
