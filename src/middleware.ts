import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isHomePage = req.nextUrl.pathname === "/";

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth && !isAuthPage && !isHomePage) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 