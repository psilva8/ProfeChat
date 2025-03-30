import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get test user ID
    const testUser = await db.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    });

    if (!testUser) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Fetch lesson plans for test user
    const lessonPlans = await db.lessonPlan.findMany({
      where: {
        userId: testUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(lessonPlans);
  } catch (error) {
    console.error('Error fetching test lesson plans:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
} 