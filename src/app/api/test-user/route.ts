import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// WARNING: This endpoint is for development testing only and should be removed in production

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    // Check if test user already exists
    const existingUser = await db.user.findFirst({
      where: {
        email: "test@example.com",
      },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Test user already exists",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    // Create a test user record
    const user = await db.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        // Using a pre-hashed version of "password123" - this is ONLY for testing
        password: "$2a$10$CwT4xzJeiOtPFcwV7F3JHu.MKNkdO6lep.S3lUiVww4aFrUEKScve", 
      },
    });

    // Create a test lesson plan for this user
    const lessonPlan = await db.lessonPlan.create({
      data: {
        userId: user.id,
        grade: "5",
        subject: "Mathematics",
        topic: "Fractions",
        duration: 45,
        objectives: "Understanding fractions as parts of a whole",
        content: "This is a test lesson plan created for development purposes.",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      lessonPlan: {
        id: lessonPlan.id,
        topic: lessonPlan.topic,
      },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { error: "Failed to create test user", details: (error as Error).message },
      { status: 500 }
    );
  }
} 