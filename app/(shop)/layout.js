import Link from "next/link";
import CartBadge from "../components/CartBadge";

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold">
              M
            </div>
            <span className="text-lg font-bold text-gray-900">Mctaba Shop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/products"
              className="text-gray-600 transition hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-600 transition hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/leads"
              className="text-gray-600 transition hover:text-gray-900"
            >
              Leads
            </Link>
            <CartBadge />
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Mctaba Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
