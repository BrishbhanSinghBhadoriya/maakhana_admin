import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("accessToken")?.value || request.cookies.get("refreshToken")?.value;
  console.log("isLoggedIn", isLoggedIn);

  const protectedRoutes = [
    "/dashboard",
    "/orders",
    "/users",
    "/product",
    "/add_new_product",
  ];

  const pathname = request.nextUrl.pathname;


  if (!isLoggedIn && protectedRoutes.some(r => pathname.startsWith(r))) {
    console.log("protectedRoutes", protectedRoutes);
    console.log("pathname", pathname);
    return NextResponse.redirect(new URL("/login?reason=middleware", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
