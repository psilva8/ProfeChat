import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, grade, subject, type, duration, objectives, materials } = body;

    if (!title || !grade || !subject || !type || !duration || !objectives || !materials) {
      return new NextResponse('Missing required fields', { status: 400 });
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
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto en educación especializado en la creación de actividades educativas. Tus respuestas deben ser claras, específicas y adecuadas para el nivel educativo indicado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const generatedContent = JSON.parse(response.choices[0].message.content || '{}');

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
    console.error('[ACTIVITY_GENERATION_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 