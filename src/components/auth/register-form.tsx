'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic client-side validation
    const newErrors: typeof errors = {};
    if (!name || name.trim().length === 0) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!email || !email.includes('@')) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending registration request:', { name, email });
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);

      if (!response.ok) {
        if (response.status === 400) {
          // Validation error or user already exists
          setErrors({
            general: data.error || 'Error de validación'
          });
          toast.error(data.error || 'Error de validación');
        } else if (response.status === 500) {
          // Server error
          const errorMessage = data.error || 'Error interno del servidor';
          const details = data.details ? `: ${data.details}` : '';
          setErrors({
            general: `${errorMessage}${details}`
          });
          toast.error(errorMessage);
        } else {
          // Other errors
          setErrors({
            general: data.error || 'Error al registrar usuario'
          });
          toast.error(data.error || 'Error al registrar usuario');
        }
        return;
      }

      toast.success('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      // Wait a bit before redirecting to show the success message
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Ocurrió un error al registrar el usuario';
      
      if (!navigator.onLine) {
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setErrors({
        general: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={`block w-full appearance-none rounded-md border ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`block w-full appearance-none rounded-md border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className={`block w-full appearance-none rounded-md border ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm`}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              La contraseña debe tener al menos 6 caracteres
            </p>
          )}
        </div>
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </div>
    </form>
  );
} 