import { auth } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

interface RubricResponse {
  rubric: {
    criteria: Array<{
      name: string;
      levels: {
        destacado: string;
        satisfactorio: string;
        enProceso: string;
        inicial: string;
      };
    }>;
  };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, grade, subject, criteria } = body;

    if (!title || !grade || !subject || !criteria) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Format criteria for the prompt
    const formattedCriteria = criteria
      .map((c: { name: string; description: string }) => `${c.name}: ${c.description}`)
      .join('\n');

    const prompt = `Por favor, genera una rúbrica de evaluación detallada para ${title} en el grado ${grade} de primaria para la asignatura de ${subject}.

Los criterios a evaluar son:
${formattedCriteria}

Para cada criterio, genera 4 niveles de desempeño:
- Destacado (4 puntos)
- Satisfactorio (3 puntos)
- En proceso (2 puntos)
- Inicial (1 punto)

Formato de respuesta:
{
  "rubric": {
    "criteria": [
      {
        "name": "Nombre del criterio",
        "levels": {
          "destacado": "Descripción del nivel destacado",
          "satisfactorio": "Descripción del nivel satisfactorio",
          "enProceso": "Descripción del nivel en proceso",
          "inicial": "Descripción del nivel inicial"
        }
      }
    ]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto en educación especializado en la creación de rúbricas de evaluación. Tus respuestas deben ser claras, específicas y adecuadas para el nivel educativo indicado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    let generatedContent: RubricResponse;
    try {
      generatedContent = JSON.parse(content);
    } catch (error) {
      console.error('[JSON_PARSE_ERROR]', error);
      return new NextResponse('Invalid response format', { status: 500 });
    }

    // Save the rubric to the database
    const rubric = await db.rubric.create({
      data: {
        userId: session.user.id,
        title,
        subject,
        grade,
        criteria: JSON.stringify(criteria),
        content,
      },
    });

    return NextResponse.json(rubric);
  } catch (error) {
    console.error('[RUBRIC_GENERATION_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 