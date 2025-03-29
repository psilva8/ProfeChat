import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ActivityDetail {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: string;
  duration: number;
  objectives: string;
  content: string;
  materials: string;
  createdAt: Date;
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { activityId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  const activity = await db.activity.findUnique({
    where: {
      id: params.activityId,
      userId: session.user.id,
    },
  });

  if (!activity) {
    notFound();
  }

  const materials = JSON.parse(activity.materials);

  let activityContent;
  try {
    activityContent = JSON.parse(activity.content);
  } catch (error) {
    console.error('Error parsing activity content:', error);
    activityContent = { activity: { description: activity.content } };
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {activity.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {activity.subject} • {activity.grade}° Grado • {activity.type} • {activity.duration} minutos
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Objetivos</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activity.objectives}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Materiales</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  {materials.map((material: string, index: number) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activityContent.activity?.description || ''}
              </dd>
            </div>
            {activityContent.activity?.steps && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pasos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ol className="list-decimal pl-5 space-y-2">
                    {activityContent.activity.steps.map((step: any, index: number) => (
                      <li key={index}>{step.description}</li>
                    ))}
                  </ol>
                </dd>
              </div>
            )}
            {activityContent.activity?.adaptations && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Adaptaciones</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {activityContent.activity.adaptations.map((adaptation: string, index: number) => (
                      <li key={index}>{adaptation}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {activityContent.activity?.evaluationCriteria && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Criterios de evaluación</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {activityContent.activity.evaluationCriteria.map((criterion: string, index: number) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {activityContent.activity?.variations && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Variaciones</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {activityContent.activity.variations.map((variation: string, index: number) => (
                      <li key={index}>{variation}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
} 