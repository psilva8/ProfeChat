'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RubricCriterion {
  name: string;
  levels: {
    destacado: string;
    satisfactorio: string;
    enProceso: string;
    inicial: string;
  };
}

interface RubricContent {
  rubric: {
    criteria: RubricCriterion[];
  };
}

export default function RubricPage({ params }: { params: { rubricId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rubric, setRubric] = useState<any>(null);

  useEffect(() => {
    const loadRubric = async () => {
      try {
        const session = await auth();
        if (!session?.user?.id) {
          router.push('/auth/login?callbackUrl=/dashboard/rubrics/' + params.rubricId);
          return;
        }

        const rubricData = await db.rubric.findUnique({
          where: { id: params.rubricId },
        });

        if (!rubricData) {
          router.push('/dashboard/rubrics');
          return;
        }

        setRubric(rubricData);
      } catch (error) {
        console.error('Error loading rubric:', error);
        router.push('/dashboard/rubrics');
      } finally {
        setIsLoading(false);
      }
    };

    loadRubric();
  }, [router, params.rubricId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!rubric) {
    return <div>Rubric not found</div>;
  }

  const content: RubricContent = JSON.parse(rubric.content);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{rubric.title}</h1>
        <div className="mt-2 flex gap-4 text-sm text-gray-500">
          <p>Grado: {rubric.grade}° Primaria</p>
          <p>Asignatura: {rubric.subject}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criterio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destacado (4)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satisfactorio (3)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                En Proceso (2)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inicial (1)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.rubric.criteria.map((criterion, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                  {criterion.name}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  {criterion.levels.destacado}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  {criterion.levels.satisfactorio}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  {criterion.levels.enProceso}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  {criterion.levels.inicial}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 