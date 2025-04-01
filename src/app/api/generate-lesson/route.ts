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
    // Parse the request body
    const requestData = await request.json();
    console.log('Request data:', requestData);
    
    // Extract parameters
    const { subject, grade, topic, competency } = requestData;
    
    // Validate required fields
    if (!subject || !grade || !topic) {
      console.error('Missing required parameters', { subject, grade, topic });
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: subject, grade, and topic are required',
        lesson_plan: null
      }, { status: 400 });
    }
    
    // If in a build environment or Vercel deployment, return test data
    if (isBuildEnvironment()) {
      console.log('Using test lesson plan data (build environment or Vercel)');
      
      // Generate a tailored test lesson plan based on the request
      const lessonPlan = generateTestLessonPlan(subject, grade, topic, competency);
      
      return NextResponse.json({
        success: true,
        lesson_plan: lessonPlan,
        message: 'Generated lesson plan using test data (build environment)'
      });
    }
    
    // In development, try to connect to Flask API
    try {
      const flaskUrl = getFlaskUrl();
      
      // If no Flask URL is configured, return test data
      if (!flaskUrl) {
        console.log('No Flask URL configured, returning test data');
        return NextResponse.json({
          success: true,
          lesson_plan: generateTestLessonPlan(subject, grade, topic, competency),
          message: 'Generated lesson plan using test data (no Flask URL)'
        });
      }
      
      console.log(`Attempting to connect to Flask API at: ${flaskUrl}/api/generate-lesson`);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      try {
        const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.error(`Flask API error: ${response.status} ${response.statusText}`);
          throw new Error(`Flask API returned status ${response.status}`);
        }
        
        const flaskResponse = await response.json();
        console.log('Flask API response received');
        
        return NextResponse.json(flaskResponse);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError; // Re-throw for the outer catch block
      }
    } catch (error) {
      console.error('Error connecting to Flask API:', error);
      console.log('Falling back to test lesson plan data');
      
      // Return test data as fallback
      return NextResponse.json({
        success: true,
        lesson_plan: generateTestLessonPlan(subject, grade, topic, competency),
        message: 'Generated lesson plan using test data (Flask API unavailable)'
      });
    }
  } catch (error) {
    console.error('Error in generate-lesson endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate lesson plan',
      message: error instanceof Error ? error.message : String(error),
      lesson_plan: null
    }, { status: 500 });
  }
}

/**
 * Generate a test lesson plan based on the provided parameters
 */
function generateTestLessonPlan(subject: string, grade: string, topic: string, competency?: string) {
  // Define a lesson title based on the topic
  const title = `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Lección para ${grade.toLowerCase()}`;
  
  // Create objectives relevant to the subject and topic
  let objectives = [
    `Comprender los conceptos fundamentales de ${topic}.`,
    `Aplicar conocimientos de ${topic} en situaciones prácticas.`,
    `Desarrollar habilidades críticas relacionadas con ${topic}.`
  ];
  
  // Customize materials based on subject
  let materials = [
    "Libro de texto",
    "Hojas de trabajo",
    "Recursos visuales"
  ];
  
  if (subject.toLowerCase().includes('mate')) {
    materials.push("Calculadoras", "Materiales manipulativos para fracciones");
  } else if (subject.toLowerCase().includes('ciencia')) {
    materials.push("Materiales para experimentos", "Modelos científicos");
  } else if (subject.toLowerCase().includes('comun')) {
    materials.push("Textos de lectura", "Diccionarios");
  }
  
  // Create a lesson structure based on competency if provided
  const competencyFocus = competency 
    ? `Con enfoque en: ${competency}`
    : 'Enfoque general del currículo';
  
  // Create a simple lesson plan structure
  return {
    title,
    subject,
    grade,
    duration: "45 minutos",
    objectives,
    standards: [
      `Estándar curricular relacionado con ${topic} para ${grade.toLowerCase()}`,
      competencyFocus
    ],
    materials,
    warmup: {
      title: "Activación de conocimientos previos",
      description: `Iniciar con preguntas relacionadas con ${topic} para identificar conocimientos previos.`,
      duration: "5 minutos"
    },
    activities: [
      {
        title: "Presentación conceptual",
        description: `Explicar los conceptos básicos de ${topic} utilizando ejemplos y recursos visuales.`,
        duration: "15 minutos"
      },
      {
        title: "Actividad práctica",
        description: `Los estudiantes trabajarán en parejas aplicando los conceptos de ${topic} en ejercicios prácticos.`,
        duration: "15 minutos"
      }
    ],
    closure: {
      title: "Síntesis y evaluación",
      description: "Resumir los conceptos clave aprendidos y realizar una evaluación rápida para verificar comprensión.",
      duration: "5 minutos"
    },
    assessment: {
      title: "Evaluación formativa",
      description: "Observación directa, preguntas durante la clase y revisión de los ejercicios prácticos."
    },
    homework: {
      title: "Práctica adicional",
      description: `Completar ejercicios relacionados con ${topic} para reforzar el aprendizaje.`
    },
    differentiation: {
      advanced: "Proporcionar problemas de mayor complejidad que requieran aplicación avanzada.",
      support: "Ofrecer ejemplos adicionales y apoyo personalizado para estudiantes que lo requieran."
    },
    notes: `Esta lección está diseñada para introducir los conceptos básicos de ${topic} en el nivel de ${grade.toLowerCase()}.`
  };
} 