'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  // If user is already authenticated, redirect to dashboard
  if (status === 'authenticated') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea tu cuenta para comenzar a usar ProfeChat
          </p>
        </div>
        <RegisterForm />
        <div className="text-center">
          <Link href="/auth/login" className="font-medium text-accent-600 hover:text-accent-500">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
} 