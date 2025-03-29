import { NextRequest, NextResponse } from "next/server";
import { signIn } from 'next-auth/react';

// Return HTML for GET requests
export function GET() {
  return NextResponse.redirect('/auth/login');
}

// Handle POST requests for signin
export async function POST() {
  try {
    // Since this is a server component, we cannot directly use signIn from next-auth/react
    // Instead, redirect to the NextAuth signin endpoint
    return NextResponse.redirect('/api/auth/signin');
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
