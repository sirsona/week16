// app/sitemap.js
import pool from "@/lib/db";

export default async function sitemap() {
  const base = "http://localhost:3000";

  let productUrls = [];

  try {
    const { rows } = await pool.query(
      "SELECT slug, created_at FROM products",
    );
    productUrls = rows.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(p.created_at || new Date()),
    }));
  } catch {
    // If the database fails, return only static pages
  }

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    ...productUrls,
  ];
}
