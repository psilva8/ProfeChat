import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use the actual user ID from registration
    const testUser = {
      id: 'cm8nnwis80002g52d5vu7bmeo',
      name: 'Test User',
      email: 'test@example.com',
    };
    
    // Test directly fetching lesson plans
    const lessonPlans = await db.lessonPlan.findMany({
      where: {
        userId: testUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      lessonPlans,
      user: testUser,
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
} 