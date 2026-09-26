// app/(shop)/about/page.js
import Link from "next/link";

export const metadata = {
  title: "About | Mctaba Shop",
  description:
    "Learn more about Mctaba Shop and our mission to make great books accessible to everyone.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-linear-to-b from-indigo-50/40 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
            Our Story
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900">
            About Mctaba Shop
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            We believe that books have the power to change careers, build
            businesses, and transform lives. Mctaba Shop was created to make
            high-quality books accessible to readers across Kenya.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Why we started</h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Mctaba Shop began with a simple idea: finding great books in Kenya
              should be easy, affordable, and enjoyable. We wanted to build a
              bookstore that feels modern, trustworthy, and focused on lifelong
              learning.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're a software engineer, entrepreneur, student, or
              simply someone who loves reading, our goal is to connect you with
              books that offer practical knowledge and lasting value.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
            <h3 className="text-xl font-semibold text-gray-900">Our mission</h3>

            <p className="mt-4 leading-7 text-gray-600">
              To make world-class books accessible to every ambitious reader in
              Kenya through a fast, secure, and delightful online shopping
              experience.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <span className="text-gray-700">
                  Carefully curated catalogue
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <span className="text-gray-700">
                  Reliable nationwide delivery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span className="text-gray-700">
                  Secure M-Pesa and card payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What we value</h2>

            <p className="mt-3 text-gray-600">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="text-4xl">✨</div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Quality
              </h3>
              <p className="mt-3 text-gray-600">
                We focus on books that provide real insight, practical
                knowledge, and long-term value.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="text-4xl">🤝</div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Trust
              </h3>
              <p className="mt-3 text-gray-600">
                Transparent pricing, secure payments, and reliable delivery are
                at the heart of our business.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="text-4xl">🚀</div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Growth
              </h3>
              <p className="mt-3 text-gray-600">
                We believe learning is one of the best investments anyone can
                make in their future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to find your next great book?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore our collection of carefully selected books and start your
            next learning journey today.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Browse Books
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
