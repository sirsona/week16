// app/api/orders/[id]/status/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  const { rows } = await pool.query(
    "SELECT status FROM orders WHERE id = $1",
    [id],
  );
  if (!rows[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ status: rows[0].status });
}
