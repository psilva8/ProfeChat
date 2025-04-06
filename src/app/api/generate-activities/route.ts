import { NextRequest, NextResponse } from 'next/server';
import { callApi } from '@/app/utils/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Sample generated activities data for math
const MATH_ACTIVITIES = [
  {
    id: 'gen-activity-1',
    title: 'Fracciones con material manipulativo',
    grade: 'PRIMARIA',
    duration: 45,
    subject: 'Matemática',
    content: {
      description: 'Los estudiantes exploran el concepto de fracciones utilizando materiales concretos.',
      objectives: 'Comprender el concepto de fracción como parte de un todo y representar fracciones usando objetos concretos.',
      materials: 'Círculos fraccionarios, bloques de patrones, papel de colores',
      instructions: 'Los estudiantes trabajarán en parejas para representar diferentes fracciones con los materiales proporcionados y documentar sus hallazgos.',
      assessment: 'Capacidad para representar correctamente fracciones y explicar su razonamiento.'
    }
  },
  {
    id: 'gen-activity-2',
    title: 'Problemas de aplicación de fracciones',
    grade: 'PRIMARIA',
    duration: 30,
    subject: 'Matemática',
    content: {
      description: 'Los estudiantes resuelven problemas cotidianos que involucran fracciones.',
      objectives: 'Aplicar el conocimiento de fracciones para resolver problemas del mundo real.',
      materials: 'Hojas de trabajo, recetas de cocina, imágenes con modelos de fracciones',
      instructions: 'Los estudiantes trabajarán individualmente y luego en grupos para resolver problemas contextualizados sobre fracciones.',
      assessment: 'Precisión en los cálculos y explicación del proceso de resolución.'
    }
  },
  {
    id: 'gen-activity-3',
    title: 'Juego de comparación de fracciones',
    grade: 'PRIMARIA',
    duration: 40,
    subject: 'Matemática',
    content: {
      description: 'Los estudiantes participan en un juego competitivo para comparar fracciones.',
      objectives: 'Desarrollar habilidades para comparar fracciones y determinar su valor relativo.',
      materials: 'Tarjetas de fracciones, tablero de juego, fichas',
      instructions: 'En grupos de 4, los estudiantes toman turnos para comparar fracciones y avanzar en el tablero.',
      assessment: 'Habilidad para comparar fracciones correctamente y justificar las comparaciones.'
    }
  }
];

// Sample generated activities data for language
const LANGUAGE_ACTIVITIES = [
  {
    id: 'gen-activity-4',
    title: 'Escritura creativa de cuentos',
    grade: 'PRIMARIA',
    duration: 50,
    subject: 'Comunicación',
    content: {
      description: 'Los estudiantes escriben cuentos cortos utilizando una estructura narrativa clara.',
      objectives: 'Desarrollar habilidades de escritura creativa y aplicar estructuras narrativas.',
      materials: 'Papel, lápices, plantillas de estructura narrativa',
      instructions: 'Los estudiantes crearán un cuento con introducción, desarrollo y desenlace, incluyendo personajes y escenarios detallados.',
      assessment: 'Evaluación de la estructura narrativa, creatividad y uso del lenguaje.'
    }
  }
];

// Sample generated activities data for science
const SCIENCE_ACTIVITIES = [
  {
    id: 'gen-activity-5',
    title: 'Experimento del ciclo del agua',
    grade: 'PRIMARIA',
    duration: 60,
    subject: 'Ciencia',
    content: {
      description: 'Los estudiantes observan y documentan el ciclo del agua mediante un experimento simple.',
      objectives: 'Comprender los procesos de evaporación, condensación y precipitación en el ciclo del agua.',
      materials: 'Bolsas de plástico transparentes, agua, colorante alimentario, cinta adhesiva',
      instructions: 'Los estudiantes crearán mini ciclos del agua en bolsas de plástico y observarán los cambios durante varios días.',
      assessment: 'Precisión de las observaciones y comprensión de los procesos del ciclo del agua.'
    }
  }
];

// Function to get appropriate test activities based on subject
function getTestActivities(subject: string, grade: string, topic: string) {
  // Convert to lowercase for easier comparison
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes('mate') || subjectLower.includes('math')) {
    return {
      success: true,
      data: MATH_ACTIVITIES,
      activities: MATH_ACTIVITIES,
      message: 'Actividades de prueba para matemáticas'
    };
  } else if (subjectLower.includes('comun') || subjectLower.includes('leng') || subjectLower.includes('espa')) {
    return {
      success: true,
      data: LANGUAGE_ACTIVITIES,
      activities: LANGUAGE_ACTIVITIES,
      message: 'Actividades de prueba para lenguaje'
    };
  } else if (subjectLower.includes('cien') || subjectLower.includes('sci')) {
    return {
      success: true,
      data: SCIENCE_ACTIVITIES,
      activities: SCIENCE_ACTIVITIES,
      message: 'Actividades de prueba para ciencias'
    };
  }
  
  // Default to math activities if no match
  return {
    success: true,
    data: MATH_ACTIVITIES,
    activities: MATH_ACTIVITIES,
    message: 'Actividades de prueba generadas'
  };
}

// Function to handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/generate-activities');
  
  try {
    // Get the request data
    const requestData = await request.json();
    
    // Log the request for debugging
    console.log('Request data:', requestData);
    
    // Validate required fields
    const { subject, grade, topic } = requestData;
    
    if (!subject || !grade || !topic) {
      console.warn('Missing required fields in request:', { subject, grade, topic });
      return NextResponse.json({
        success: false,
        data: [], // Return empty data array for frontend compatibility
        activities: [], // Also include activities property for backward compatibility
        message: 'Missing required fields: subject, grade, and topic are required'
      }, { status: 400 });
    }
    
    console.log(`Generating activities for: ${subject}, ${grade}, ${topic}`);
    
    // Get test data for this request
    const testData = getTestActivities(subject, grade, topic);
    
    // Use the callApi utility function
    const responseData = await callApi('generate-activities', {
      subject: subject,
      grade: grade,
      topic: topic
    }, testData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in generate-activities endpoint:', error);
    return NextResponse.json({ 
      success: false,
      data: [], // Return empty data array for frontend compatibility
      activities: [], // Also include activities property for backward compatibility
      error: 'Failed to generate activities',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 200 }); // Return 200 status with error info instead of 500
  }
} 