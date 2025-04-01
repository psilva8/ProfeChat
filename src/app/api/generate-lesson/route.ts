import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl, isBuildEnvironment } from '@/utils/api';

// Export dynamic flag to ensure this route is always evaluated dynamically
export const dynamic = 'force-dynamic';

// Sample lesson plan for test/build environments
const TEST_LESSON_PLAN = {
  title: "Introducción a las fracciones equivalentes",
  subject: "Matemática",
  grade: "PRIMARIA",
  duration: "45 minutos",
  objectives: [
    "Comprender el concepto de fracciones equivalentes.",
    "Identificar fracciones equivalentes utilizando representaciones visuales.",
    "Aplicar métodos para encontrar fracciones equivalentes."
  ],
  standards: [
    "Reconoce fracciones equivalentes y las representa de manera visual.",
    "Resuelve problemas que involucran fracciones equivalentes."
  ],
  materials: [
    "Cartulinas con círculos divididos en diferentes fracciones",
    "Hojas de trabajo",
    "Lápices de colores",
    "Pizarra y marcadores"
  ],
  warmup: {
    title: "Repaso de fracciones básicas",
    description: "Comenzar con un breve repaso sobre el concepto de fracción como parte de un todo. Utilizar ejemplos visuales como dividir un círculo en partes iguales.",
    duration: "5 minutos"
  },
  activities: [
    {
      title: "Exploración visual de fracciones equivalentes",
      description: "Mostrar a los estudiantes cómo diferentes fracciones pueden representar la misma cantidad utilizando círculos fraccionarios. Demostrar que 1/2 es equivalente a 2/4, 3/6, etc.",
      duration: "15 minutos"
    },
    {
      title: "Práctica guiada",
      description: "Distribuir hojas de trabajo donde los estudiantes deben colorear representaciones visuales para identificar fracciones equivalentes. Trabajar en parejas para discutir sus respuestas.",
      duration: "15 minutos"
    }
  ],
  closure: {
    title: "Síntesis y reflexión",
    description: "Discutir las estrategias utilizadas para identificar fracciones equivalentes. Pedir a los estudiantes que expliquen cómo saben que dos fracciones son equivalentes.",
    duration: "5 minutos"
  },
  assessment: {
    title: "Evaluación formativa",
    description: "Observar la participación de los estudiantes durante las actividades. Revisar las hojas de trabajo para verificar la comprensión de fracciones equivalentes."
  },
  homework: {
    title: "Práctica adicional",
    description: "Completar una hoja de ejercicios sobre fracciones equivalentes que incluya problemas contextualizados."
  },
  differentiation: {
    advanced: "Proporcionar problemas más complejos que involucren simplificación de fracciones.",
    support: "Ofrecer material manipulativo adicional y ejemplos visuales para estudiantes que necesiten apoyo."
  },
  notes: "Asegurarse de vincular el concepto de fracciones equivalentes con situaciones de la vida cotidiana para hacer el aprendizaje más significativo."
};

// Handle OPTIONS request (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle POST request
export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/generate-lesson');
  
  try {
    // Parse request body
    const body = await request.json();
    const { subject, competency, grade, topic } = body;

    // Validate required parameters
    if (!subject || !grade || !topic) {
      console.error('Missing required parameters', { subject, grade, topic });
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: subject, grade, and topic are required' },
        { status: 400 }
      );
    }

    console.log(`Generating lesson plan for: ${subject}, ${grade}, ${topic}`);
    
    // If in a build environment or Vercel deployment, return test data
    if (isBuildEnvironment()) {
      console.log('Using test lesson plan data (build environment or Vercel)');
      return NextResponse.json({
        success: true,
        lesson_plan: TEST_LESSON_PLAN,
        message: 'Generated lesson plan using test data'
      });
    }
    
    // In development, try to connect to Flask API
    try {
      const flaskUrl = getFlaskUrl();
      console.log(`Attempting to connect to Flask API at: ${flaskUrl}/api/generate-lesson`);
      
      const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, competency, grade, topic }),
      });
      
      if (!response.ok) {
        console.error(`Flask API error: ${response.status} ${response.statusText}`);
        throw new Error(`Flask API returned status ${response.status}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (error) {
      console.error('Error connecting to Flask API:', error);
      console.log('Falling back to test lesson plan data');
      
      // Return test data as fallback
      return NextResponse.json({
        success: true,
        lesson_plan: TEST_LESSON_PLAN,
        message: 'Generated lesson plan using test data (Flask API unavailable)'
      });
    }
  } catch (error) {
    console.error('Error in generate-lesson API route:', error);
    return NextResponse.json(
      { success: false, error: `Failed to generate lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 