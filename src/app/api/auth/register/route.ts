import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este correo electrónico' },
        { status: 400 }
      );
    }

    try {
      const hashedPassword = await bcryptjs.hash(password, 10);

      const user = await db.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });

      return NextResponse.json(
        { message: 'Usuario creado exitosamente' },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Error al crear el usuario en la base de datos' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 