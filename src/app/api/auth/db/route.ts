import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    try {
      // Test database connection
      await db.$connect();

      const user = await db.user.findUnique({
        where: { email }
      });

      if (!user || !user?.password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!isCorrectPassword) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
      await db.$disconnect();
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 