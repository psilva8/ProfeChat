import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const runtime = 'nodejs';
export const preferredRegion = 'home';

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(req: Request) {
  try {
    console.log('Received registration request');
    
    // Check if request has a body
    if (!req.body) {
      console.error('No request body received');
      return NextResponse.json(
        { error: 'No se recibieron datos del formulario' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log('Request body:', { ...body, password: '[REDACTED]' });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Error al procesar los datos del formulario' },
        { status: 400 }
      );
    }
    
    let validatedData;
    try {
      validatedData = registerSchema.parse(body);
      console.log('Validation passed');
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.log('Validation error:', validationError.errors);
        return NextResponse.json(
          { error: validationError.errors[0].message },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const { name, email, password } = validatedData;

    try {
      // Test database connection
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
    } catch (dbError) {
      const error = dbError as Error;
      console.error('Database error details:', {
        name: error.name,
        message: error.message,
        code: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.code : 'N/A',
        meta: dbError instanceof Prisma.PrismaClientKnownRequestError ? dbError.meta : 'N/A'
      });

      // Check if it's a unique constraint violation
      if (
        dbError instanceof Prisma.PrismaClientKnownRequestError &&
        dbError.code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este correo electrónico' },
          { status: 400 }
        );
      }

      // Check for connection errors
      if (dbError instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database initialization error:', dbError);
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Error al crear el usuario en la base de datos', details: error.message },
        { status: 500 }
      );
    } finally {
      await db.$disconnect();
    }
  } catch (error) {
    const err = error as Error;
    console.error('Unexpected error during registration:', err);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar la solicitud', details: err.message },
      { status: 500 }
    );
  }
} 