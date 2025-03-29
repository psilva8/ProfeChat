import { NextRequest, NextResponse } from "next/server";

// Return HTML for GET requests
export function GET() {
  return NextResponse.redirect('/auth/login');
}

// Handle POST requests for signin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Redirect to the built-in NextAuth signin with credentials
    const url = new URL('/api/auth/[...nextauth]', request.url);
    url.searchParams.append('callbackUrl', '/dashboard');
    
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication error', message: 'There was a problem with the authentication process' },
      { status: 500 }
    );
  }
}
