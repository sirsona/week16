// app/api/admin/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.redirect(new URL("/login", request.url));
}
