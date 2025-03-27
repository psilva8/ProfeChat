import { NextResponse } from 'next/server';

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TestResponse {
  message: string;
}

export async function GET(): Promise<NextResponse<TestResponse>> {
  return NextResponse.json({ message: 'Test auth endpoint' });
} 