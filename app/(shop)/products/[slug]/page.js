import AddToCartButton from "@/app/components/AddToCartButton";
import BuyNowButton from "@/app/components/BuyNowButton";
import pool from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const { rows } = await pool.query("SELECT slug FROM products");
    return rows.map((p) => ({ slug: p.slug }));
  } catch {
    console.warn("Skipping static generation — database unreachable");
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE slug = $1",
      [slug],
    );
    const product = rows[0];
    return {
      title: `${product.name} | Mctaba Shop`,
      description: product.description,
    };
  } catch {
    return {
      title: "Product not found | Mctaba Shop",
    };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE slug = $1",
      [slug],
    );
    product = rows[0];
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900">
            Books
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              Featured Book
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              KSh {(product.price_cents / 100).toLocaleString()}
            </p>

            <div className="mt-6">
              {product.in_stock > 0 ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {product.in_stock} in stock
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  Out of stock
                </span>
              )}
            </div>

            <p className="mt-8 text-lg leading-8 text-gray-600">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <div className="flex w-32 items-center rounded-xl border border-gray-200">
                <button className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100">
                  −
                </button>
                <div className="flex-1 text-center font-medium">1</div>
                <button className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <AddToCartButton
                productId={product.id}
                priceCents={product.price_cents}
              />
              <BuyNowButton
                productId={product.id}
                priceCents={product.price_cents}
              />
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 space-y-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-xl">🚚</span>
                <span>Fast nationwide delivery across Kenya</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-xl">🔒</span>
                <span>Secure checkout with M-Pesa and card payments</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-xl">↩️</span>
                <span>Easy returns within 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <section className="mt-24 border-t border-gray-100 pt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              You may also like
            </h2>

            <Link
              href="/products"
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Browse all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="aspect-[4/5] rounded-2xl bg-gray-100" />
                <h3 className="mt-4 font-semibold text-gray-900">
                  Recommended Book
                </h3>
                <p className="mt-2 text-gray-600">KSh 2,499</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
