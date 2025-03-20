import React from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface ActivityStep {
  order: number;
  description: string;
}

interface ActivityContent {
  activity: {
    description: string;
    steps: ActivityStep[];
    adaptations: string[];
    evaluationCriteria: string[];
    variations: string[];
  };
}

export default async function ActivityPage({
  params,
}: {
  params: { activityId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return notFound();
  }

  const activity = await db.activity.findUnique({
    where: {
      id: params.activityId,
      userId: session.user.id,
    },
  });

  if (!activity) {
    return notFound();
  }

  const content: ActivityContent = JSON.parse(activity.content);
  const materials = JSON.parse(activity.materials);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          <p>Grado: {activity.grade}° Primaria</p>
          <p>Asignatura: {activity.subject}</p>
          <p>Tipo: {activity.type}</p>
          <p>Duración: {activity.duration} minutos</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
          <p className="text-gray-700">{content.activity.description}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivos</h2>
          <p className="text-gray-700">{activity.objectives}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Materiales Necesarios</h2>
          <ul className="list-disc list-inside text-gray-700">
            {materials.map((material: string, index: number) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Paso a Paso</h2>
          <div className="space-y-4">
            {content.activity.steps.map((step) => (
              <div key={step.order} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 font-medium">{step.order}</span>
                </div>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sugerencias de Adaptación</h2>
          <ul className="list-disc list-inside text-gray-700">
            {content.activity.adaptations.map((adaptation, index) => (
              <li key={index}>{adaptation}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Criterios de Evaluación</h2>
          <ul className="list-disc list-inside text-gray-700">
            {content.activity.evaluationCriteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Variaciones y Extensiones</h2>
          <ul className="list-disc list-inside text-gray-700">
            {content.activity.variations.map((variation, index) => (
              <li key={index}>{variation}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
} 