import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { db } from '@/lib/db';

export default async function RubricsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  const rubrics = await db.rubric.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rúbricas</h1>
        <Link
          href="/dashboard/rubrics/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nueva Rúbrica
        </Link>
      </div>

      {rubrics.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay rúbricas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva rúbrica.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/rubrics/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Crear Rúbrica
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {rubrics.map((rubric) => (
              <li key={rubric.id}>
                <Link
                  href={`/dashboard/rubrics/${rubric.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-accent-600 truncate">
                          {rubric.title}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          {rubric.subject} • {rubric.grade}° Grado
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {new Date(rubric.createdAt).toLocaleDateString()}
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