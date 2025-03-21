import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const runtime = 'nodejs';
export const preferredRegion = 'home';

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received registration request:', { ...body, password: '[REDACTED]' });

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Datos de registro inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    try {
      // Test database connection
      console.log('Testing database connection...');
      await db.$connect();
      console.log('Database connection successful');

      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este correo electrónico' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      console.log('Password hashed successfully');

      const user = await db.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });
      console.log('User created successfully:', { id: user.id, email: user.email });

      return NextResponse.json(
        { message: 'Usuario creado exitosamente' },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error('Database error details:', {
        name: dbError.name,
        message: dbError.message,
        code: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.code : 'N/A',
        meta: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.meta : 'N/A'
      });

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: 'Ya existe una cuenta con este correo electrónico' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { 
          error: 'Error al conectar con la base de datos',
          details: dbError.message
        },
        { status: 500 }
      );
    } finally {
      await db.$disconnect();
    }
  } catch (error: any) {
    console.error('Unexpected error during registration:', error);
    return NextResponse.json(
      { 
        error: 'Error inesperado durante el registro',
        details: error.message
      },
      { status: 500 }
    );
  }
} 