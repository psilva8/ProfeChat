import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  console.log('Handling POST request to /api/generate-lesson');
  
  try {
    // Get the request data
    const requestData = await request.json();
    console.log('Request data:', requestData);
    
    // Validate required fields
    const { subject, grade, topic, competency } = requestData;
    
    if (!subject || !grade || !topic) {
      console.warn('Missing required fields in request:', { subject, grade, topic });
      return NextResponse.json({
        success: false,
        data: null, // Return null for frontend compatibility
        message: 'Missing required fields: subject, grade, and topic are required'
      }, { status: 400 });
    }
    
    // Generate sample lesson plan based on the request data
    const duration = requestData.duration || 60;
    
    // More structured lesson plan data
    const lessonPlanData = {
      title: `Introducción a las ${topic} - ${subject} (${grade})`,
      subject,
      grade,
      topic,
      duration,
      competency: competency || 'Competencia general',
      objectives: [
        `Los estudiantes comprenderán los conceptos clave relacionados con ${topic}`,
        `Los estudiantes podrán aplicar conocimientos en ejercicios prácticos`,
        `Los estudiantes desarrollarán habilidades de pensamiento crítico a través de la discusión`
      ],
      materials: [
        'Libro de texto',
        'Hojas de trabajo',
        'Materiales manipulativos',
        'Recursos digitales interactivos'
      ],
      activities: [
        {
          name: 'Inicio',
          duration: '10 minutos',
          description: `Comenzar la lección con una actividad de calentamiento para activar conocimientos previos. Preguntar a los estudiantes qué saben sobre ${topic} y registrar sus respuestas.`
        },
        {
          name: 'Desarrollo',
          duration: '25 minutos',
          description: 'Presentar conceptos clave utilizando ayudas visuales y demostraciones interactivas. Guiar a los estudiantes a través de ejemplos en la pizarra.'
        },
        {
          name: 'Práctica',
          duration: '15 minutos',
          description: 'Los estudiantes trabajan en parejas en problemas prácticos mientras el profesor circula para brindar orientación y apoyo.'
        },
        {
          name: 'Cierre',
          duration: '10 minutos',
          description: 'Resumir los puntos clave aprendidos hoy y asignar tarea que refuerce los conceptos del día.'
        }
      ],
      assessment: {
        method: 'Evaluación formativa',
        description: 'Boleto de salida con 3-5 preguntas para verificar la comprensión del material del día.'
      },
      differentiation: {
        advanced: 'Proporcionar problemas más desafiantes para estudiantes avanzados.',
        support: 'Ofrecer andamiaje adicional para estudiantes que necesitan apoyo.'
      }
    };
    
    return NextResponse.json({
      success: true,
      data: lessonPlanData,
      message: 'Plan de lección de muestra generado correctamente'
    });
  } catch (error) {
    console.error('Error in generate-lesson endpoint:', error);
    return NextResponse.json({ 
      success: false,
      data: null, // Return null for frontend compatibility 
      error: 'Failed to generate lesson plan',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 