import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use the actual user ID from registration
    const testUserId = 'cm8nnwis80002g52d5vu7bmeo';
    
    // Create a sample lesson plan
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: testUserId,
        grade: '5',
        subject: 'Mathematics',
        topic: 'Place Value',
        duration: 60,
        objectives: 'Understand place value and add multi-digit numbers',
        content: 'This is the content of the sample lesson plan created through the API test.',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sample lesson plan created',
      lessonPlan
    });
  } catch (error) {
    console.error('Error creating sample lesson plan:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
} 