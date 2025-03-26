import { NextRequest, NextResponse } from "next/server";
import { signIn } from '@/lib/auth';

// Return HTML for GET requests
export function GET() {
  return NextResponse.redirect('/auth/login');
}

// Handle POST requests for signin
export async function POST() {
  try {
    const result = await signIn('credentials', {
      redirect: false,
    });

    if (!result?.ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
