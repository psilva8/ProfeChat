import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Sample generated activities data
const SAMPLE_GENERATED_ACTIVITIES = [
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
    
    // Return the sample data with both formats for compatibility
    return NextResponse.json({
      success: true,
      data: SAMPLE_GENERATED_ACTIVITIES, // Newer format using "data" property
      activities: SAMPLE_GENERATED_ACTIVITIES, // Legacy format using "activities" property
      message: 'Sample generated activities for diagnostic purposes'
    });
  } catch (error) {
    console.error('Error in generate-activities endpoint:', error);
    return NextResponse.json({ 
      success: false,
      data: [], // Return empty data array for frontend compatibility
      activities: [], // Also include activities property for backward compatibility
      error: 'Failed to generate activities',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 