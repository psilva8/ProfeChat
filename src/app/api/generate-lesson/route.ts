import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData } from '@/app/utils/api';
import fs from 'fs';
import path from 'path';

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
  try {
    console.log('Direct generate-lesson API called - bypassing all test data checks');
    
    const data = await request.json();
    const { subject, grade, topic, objectives, duration } = data;

    console.log(`Generate request for: ${subject}, ${grade}, ${topic}`);

    // Force direct connection to Flask - no test data
    const flaskUrl = getFlaskUrlDirect();
    
    if (!flaskUrl) {
      console.error('Could not determine Flask URL');
      return NextResponse.json({
        error: 'Flask server unavailable',
        message: 'Could not connect to language model'
      }, { status: 500 });
    }

    console.log(`Directly connecting to Flask at ${flaskUrl}/api/generate-lesson`);
    
    const flaskResponse = await fetch(`${flaskUrl}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject || 'General',
        grade: grade || 'PRIMARIA',
        topic: topic || '',
        objectives: objectives || 'Responder a la consulta del usuario',
        duration: duration || '30 minutos'
      }),
      signal: AbortSignal.timeout(20000) // 20 second timeout
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      console.error(`Flask API error: ${flaskResponse.status}`, errorText);
      return NextResponse.json({ 
        error: 'Flask API error',
        message: 'Error connecting to language model'
      }, { status: flaskResponse.status });
    }

    const flaskData = await flaskResponse.json();
    console.log('Successfully received response from Flask');
    
    return NextResponse.json(flaskData);
  } catch (error) {
    console.error('Error in generate-lesson API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get Flask URL directly from .flask-port file without any logic
function getFlaskUrlDirect(): string {
  try {
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portContent, 10);
      if (!isNaN(port) && port > 0 && port < 65536) {
        console.log(`Found Flask port ${port} in .flask-port file`);
        return `http://localhost:${port}`;
      }
    }
    
    console.log('No valid port in .flask-port, using default 5338');
    return 'http://localhost:5338';
  } catch (error) {
    console.error('Error reading .flask-port:', error);
    return '';
  }
} 