// app/admin/layout.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) redirect("/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") redirect("/");
  } catch {
    redirect("/login");
  }

  return (
    <div>
      <nav className="bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold">Mctaba Admin</h1>
            <Link href="/admin/orders" className="text-sm hover:text-gray-300">
              Orders
            </Link>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="text-sm text-gray-400 hover:text-white">
              Logout
            </button>
          </form>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
