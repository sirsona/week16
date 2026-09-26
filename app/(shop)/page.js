import pool from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Mctaba Shop",
  description: "Your local online store for quality books and more.",
  openGraph: {
    title: "Mctaba Shop",
    description: "Your local online store for quality books and more.",
    type: "website",
  },
};

export default async function HomePage() {
  // Fetch a few products to show as "Bestsellers"
  let products = [];
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, name, price_cents, image_url, in_stock, category
       FROM products
       ORDER BY created_at DESC`,
    );
    products = rows.slice(0, 4);
  } catch {
    // Gracefully fallback if the database is not available
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO SECTION (FULL WIDTH) ─── */}
      <section className="w-full bg-linear-to-br from-indigo-50 via-white to-purple-50 px-6 py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Discover stories that <br />
            <span className="text-indigo-600">move you.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Curated books, thoughtful reads, and timeless classics — delivered
            to your doorstep with care.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Books
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
      </section>
      {/* ─── FEATURES GRID (FULL WIDTH) ─── */}
      <section className="w-full bg-gray-50 px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why shop with us
            </h2>
            <p className="text-gray-600 mt-2">
              We bring the world of books to your doorstep.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Curated Selection",
                desc: "Handpicked books across genres — from sci‑fi to self‑help.",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Same‑day dispatch in Nairobi. Everywhere else, we ship within 24hrs.",
              },
              {
                icon: "💳",
                title: "Secure Checkout",
                desc: "Pay with M‑Pesa or card via Paystack. Your data is safe.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── BESTSELLERS (Product Showcase) ─── */}
      {products.length > 0 && (
        <section className="w-full bg-white px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Bestsellers
                </h2>
                <p className="text-gray-600 mt-1">
                  Our readers can't get enough of these.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline-offset-4 hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={p.image_url || "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {p.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    KSh {(p.price_cents / 100).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Newsletter */}{" "}
      <section className="py-20">
        {" "}
        <div className="mx-auto max-w-7xl px-6">
          {" "}
          <div className="rounded-3xl bg-gray-900 px-8 py-16 text-center text-white">
            {" "}
            <h2 className="text-3xl font-bold">
              {" "}
              Join our community of readers{" "}
            </h2>{" "}
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              {" "}
              Get notified when new books arrive and receive curated reading
              recommendations and exclusive offers.{" "}
            </p>{" "}
            <form className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
              {" "}
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-gray-700 bg-gray-800 px-5 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
              />{" "}
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                {" "}
                Subscribe{" "}
              </button>{" "}
            </form>{" "}
            <p className="mt-4 text-sm text-gray-400">
              {" "}
              No spam. Unsubscribe anytime.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </div>
  );
}
