import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { db } from '@/lib/db';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, grade, subject, type, duration, objectives, materials } = body;

    if (!title || !grade || !subject || !type || !duration || !objectives || !materials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Por favor, genera una actividad educativa detallada con las siguientes características:

Título: ${title}
Grado: ${grade}° de primaria
Asignatura: ${subject}
Tipo de actividad: ${type}
Duración: ${duration} minutos
Objetivos de aprendizaje: ${objectives}
Materiales necesarios: ${materials.join(', ')}

La actividad debe incluir:
1. Descripción general
2. Paso a paso detallado
3. Sugerencias de adaptación
4. Criterios de evaluación
5. Extensiones o variaciones

Formato de respuesta:
{
  "activity": {
    "description": "Descripción general de la actividad",
    "steps": [
      {
        "order": 1,
        "description": "Descripción del paso"
      }
    ],
    "adaptations": [
      "Sugerencia de adaptación 1",
      "Sugerencia de adaptación 2"
    ],
    "evaluationCriteria": [
      "Criterio de evaluación 1",
      "Criterio de evaluación 2"
    ],
    "variations": [
      "Variación o extensión 1",
      "Variación o extensión 2"
    ]
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates educational activities.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    if (!response.choices[0].message?.content) {
      return NextResponse.json(
        { error: 'Failed to generate activity' },
        { status: 500 }
      );
    }

    // Save the activity to the database
    const activity = await db.activity.create({
      data: {
        userId: session.user.id,
        title,
        subject,
        grade,
        type,
        duration,
        objectives,
        content: response.choices[0].message.content || '',
        materials: JSON.stringify(materials),
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error generating activity:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 