import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData } from '@/app/utils/api';

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

// Helper function to generate a test lesson plan
function generateTestLessonPlan(subject: string, grade: string, topic: string, competency?: string) {
  return {
    title: `Introducción a las ${topic} - ${subject} (${grade})`,
    subject,
    grade,
    topic,
    duration: 60,
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
        lesson_plan: null, // Also include lesson_plan property for backward compatibility
        message: 'Missing required fields: subject, grade, and topic are required'
      }, { status: 400 });
    }
    
    console.log(`Generating lesson plan for: ${subject}, ${grade}, ${topic}`);
    
    // Check if we should use test data
    if (shouldUseTestData()) {
      console.log('Using test data for lesson plan generation');
      const testData = generateTestLessonPlan(subject, grade, topic, competency);
      
      return NextResponse.json({
        success: true,
        data: testData,
        lesson_plan: testData,
        message: 'Plan de lección de muestra generado con datos de prueba'
      });
    }
    
    // Get Flask API URL
    const flaskUrl = getFlaskUrl();
    
    if (!flaskUrl) {
      console.log('No Flask URL available, using test data');
      const testData = generateTestLessonPlan(subject, grade, topic, competency);
      
      return NextResponse.json({
        success: true,
        data: testData,
        lesson_plan: testData,
        message: 'Plan de lección de muestra generado con datos de prueba (Flask no disponible)'
      });
    }
    
    console.log(`Attempting to connect to Flask API at: ${flaskUrl}/api/generate-lesson`);
    
    try {
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      // Check if we got a 403 Forbidden, which might indicate a non-Flask service
      if (response.status === 403) {
        console.warn(`Port ${flaskUrl.split(':')[2].split('/')[0]} is in use by another service (received 403 Forbidden)`);
        const testData = generateTestLessonPlan(subject, grade, topic, competency);
        
        return NextResponse.json({
          success: true,
          data: testData,
          lesson_plan: testData,
          message: 'Plan de lección de muestra generado con datos de prueba (puerto Flask en uso por otro servicio)'
        });
      }
      
      if (!response.ok) {
        throw new Error(`Flask API returned status ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Flask API returned error');
      }
      
      return NextResponse.json({
        success: true,
        data: data.data || data.lesson_plan,
        lesson_plan: data.data || data.lesson_plan,
        message: 'Plan de lección generado correctamente'
      });
    } catch (error) {
      console.error('Error connecting to Flask API:', error);
      console.log('Falling back to test lesson plan data');
      
      // Fallback to test data
      const testData = generateTestLessonPlan(subject, grade, topic, competency);
      
      return NextResponse.json({
        success: true,
        data: testData,
        lesson_plan: testData,
        message: 'Plan de lección de muestra generado con datos de prueba (Flask no disponible)'
      });
    }
  } catch (error) {
    console.error('Error in generate-lesson endpoint:', error);
    return NextResponse.json({ 
      success: false,
      data: null,
      lesson_plan: null,
      error: 'Failed to generate lesson plan',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 