import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

// Middleware function to handle authentication
export default auth((req) => {
  // Define all public routes that don't require authentication
  const isPublicRoute = 
    req.nextUrl.pathname === '/' || 
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/public') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/favicon.ico') ||
    req.nextUrl.pathname.startsWith('/features') ||
    req.nextUrl.pathname.startsWith('/pricing') ||
    req.nextUrl.pathname.startsWith('/rubrics') ||
    req.nextUrl.pathname.startsWith('/activities') ||
    req.nextUrl.pathname.startsWith('/lesson-planner') ||
    req.nextUrl.pathname.startsWith('/unit-planner') ||
    req.nextUrl.pathname.startsWith('/auth');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For dashboard and other protected routes
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

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