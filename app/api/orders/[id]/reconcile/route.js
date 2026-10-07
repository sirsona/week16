// app/api/orders/[id]/reconcile/route.js
import { reconcileOrder } from "@/lib/reconcile";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;

  const result = await reconcileOrder(id);
  if (result.error) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
