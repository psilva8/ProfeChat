import { NextRequest, NextResponse } from "next/server";

// Return HTML for GET requests
export function GET() {
  return NextResponse.redirect('/auth/login');
}

// Handle POST requests for signin
export async function POST(req: NextRequest) {
  try {
    // Mock successful signin
    return NextResponse.json({
      url: '/dashboard',
      ok: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
