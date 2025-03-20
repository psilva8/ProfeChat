import React from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ActivitiesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activities = await db.activity.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Actividades</h1>
        <Link
          href="/dashboard/activities/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          Nueva Actividad
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva actividad para tus estudiantes.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/activities/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              Crear Actividad
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id}>
                <Link
                  href={`/dashboard/activities/${activity.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-accent-600 truncate">
                        {activity.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {activity.subject}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-4">
                        <p className="flex items-center text-sm text-gray-500">
                          Grado: {activity.grade}° Primaria
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Tipo: {activity.type}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Duración: {activity.duration} min
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Creada el{' '}
                          {new Date(activity.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 