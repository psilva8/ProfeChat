'use client';

import React from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

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

export default async function RubricPage({
  params,
}: {
  params: { rubricId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return notFound();
  }

  const rubric = await db.rubric.findUnique({
    where: {
      id: params.rubricId,
      userId: session.user.id,
    },
  });

  if (!rubric) {
    return notFound();
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