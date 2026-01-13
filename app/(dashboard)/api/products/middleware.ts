import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/orders",
    "/users",
    "/product",
    "/add_new_product",
  ];

  const pathname = request.nextUrl.pathname;

  // agar user login nahi hai aur protected page open kar raha hai
  if (!isLoggedIn && protectedRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
