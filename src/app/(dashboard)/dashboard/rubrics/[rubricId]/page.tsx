import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface RubricDetail {
  id: string;
  title: string;
  subject: string;
  grade: string;
  content: string;
  createdAt: Date;
}

export default async function RubricDetailPage({
  params,
}: {
  params: { rubricId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  const rubric = await db.rubric.findUnique({
    where: {
      id: params.rubricId,
      userId: session.user.id,
    },
  });

  if (!rubric) {
    notFound();
  }

  let rubricContent;
  try {
    rubricContent = JSON.parse(rubric.content);
  } catch (error) {
    console.error('Error parsing rubric content:', error);
    rubricContent = { rubric: { criteria: [] } };
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {rubric.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {rubric.subject} • {rubric.grade}° Grado
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
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
                      En proceso (2)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inicial (1)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rubricContent.rubric.criteria.map((criterion: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {criterion.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {criterion.levels.destacado}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {criterion.levels.satisfactorio}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {criterion.levels.enProceso}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {criterion.levels.inicial}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 