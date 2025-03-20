import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-navy-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-navy-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="font-medium text-accent-600 hover:text-accent-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 