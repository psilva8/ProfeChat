import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = 'nodejs';

// Middleware function to handle authentication
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isPublicRoute = req.nextUrl.pathname === '/' || 
                       req.nextUrl.pathname.startsWith('/_next') ||
                       req.nextUrl.pathname.startsWith('/public');

  // Always allow public routes and API auth routes
  if (isPublicRoute || isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Redirect to login if not logged in and trying to access protected routes
  if (isDashboardRoute && !isLoggedIn) {
    const redirectUrl = new URL('/auth/login', req.nextUrl);
    redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(redirectUrl);
  }

  return NextResponse.next();
});

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 