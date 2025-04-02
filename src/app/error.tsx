'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Ha ocurrido un error</h1>
          <p className="mt-2 text-sm text-gray-600">
            Lo sentimos, algo salió mal al procesar tu solicitud.
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Error de la aplicación</h3>
          <p className="mt-2 text-sm text-red-700">
            {error.message || 'Error desconocido'}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-red-500">
              Código de error: {error.digest}
            </p>
          )}
        </div>
        
        <div className="mt-6 flex space-x-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Intentar de nuevo
          </button>
          
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
} 