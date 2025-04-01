import { NextRequest, NextResponse } from 'next/server';
import { generateActivities } from '@/services/curriculumService';
import { getFlaskUrl, isBuildEnvironment } from '@/utils/api';

export const dynamic = 'force-dynamic';

/**
 * Handler for generating learning activities based on curriculum data
 * This endpoint uses the PDF-parsed curriculum data
 */
export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/generate-activities');
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Extract parameters
    const { subject, grade, topic } = body;
    
    // Validate required fields
    if (!subject || !grade || !topic) {
      console.error('Missing required parameters', { subject, grade, topic });
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: subject, grade, and topic are required' 
      }, { status: 400 });
    }
    
    // Log the request
    console.log(`Generating activities for: ${subject}, ${grade}, ${topic}`);
    
    // If in a build environment or Vercel deployment, return test data
    if (isBuildEnvironment()) {
      console.log('Using test activities data (build environment or Vercel)');
      return NextResponse.json({
        success: true,
        data: TEST_ACTIVITIES,
        message: 'Generated activities using test data'
      });
    }
    
    // In development, try to connect to Flask API
    try {
      const flaskUrl = getFlaskUrl();
      console.log(`Attempting to connect to Flask API at: ${flaskUrl}/api/generate-activities`);
      
      const response = await fetch(`${flaskUrl}/api/generate-activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, grade, topic }),
      });
      
      if (!response.ok) {
        console.error(`Flask API error: ${response.status} ${response.statusText}`);
        throw new Error(`Flask API returned status ${response.status}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (error) {
      console.error('Error connecting to Flask API:', error);
      console.log('Falling back to test activities data');
      
      // Return test data as fallback
      return NextResponse.json({
        success: true,
        data: TEST_ACTIVITIES,
        message: 'Generated activities using test data (Flask API unavailable)'
      });
    }
  } catch (error) {
    console.error('Error in generate-activities API route:', error);
    return NextResponse.json(
      { success: false, error: `Failed to generate activities: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

/**
 * Handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

// Sample activities for test/build environment
const TEST_ACTIVITIES = [
  {
    title: "Explorando las fracciones con material concreto",
    description: "Esta actividad ayuda a los estudiantes a comprender el concepto de fracciones mediante la manipulación de materiales concretos y visuales.",
    objective: "Comprender el concepto de fracción como parte de un todo, y reconocer fracciones equivalentes utilizando representaciones concretas.",
    timeRequired: "45 minutos",
    materials: [
      "Círculos de fracciones (impresos en cartulina)",
      "Tiras de fracciones rectangulares",
      "Hojas cuadriculadas",
      "Lápices de colores"
    ],
    procedure: [
      "Organizar a los estudiantes en parejas y distribuir el material.",
      "Presentar el concepto de fracciones utilizando ejemplos cotidianos.",
      "Demostrar cómo representar 1/2, 1/4 y 3/4 utilizando los círculos de fracciones.",
      "Guiar a los estudiantes para que encuentren fracciones equivalentes usando las tiras de fracciones.",
      "Pedir a los estudiantes que representen diferentes fracciones en las hojas cuadriculadas."
    ],
    assessment: "Observación directa del trabajo de los estudiantes y revisión de las representaciones en las hojas cuadriculadas.",
    differentiation: "Para estudiantes avanzados, introducir fracciones más complejas. Para estudiantes que necesitan apoyo, comenzar con fracciones básicas como 1/2 y 1/4."
  },
  {
    title: "Creando narraciones con estructura clara",
    description: "Los estudiantes desarrollarán sus habilidades de escritura narrativa creando cuentos con una estructura definida de inicio, desarrollo y desenlace.",
    objective: "Escribir narraciones coherentes que incluyan una estructura clara con inicio, desarrollo y desenlace.",
    timeRequired: "60 minutos",
    materials: [
      "Hojas de papel",
      "Lápices y borradores",
      "Imágenes o tarjetas con escenas para inspiración",
      "Organizador gráfico de estructura narrativa"
    ],
    procedure: [
      "Revisar los elementos de una narración y la importancia de la estructura.",
      "Mostrar ejemplos de cuentos cortos con estructuras claras.",
      "Distribuir las imágenes o tarjetas con escenas para inspiración.",
      "Guiar a los estudiantes para que completen el organizador gráfico planificando su narración.",
      "Dar tiempo para que los estudiantes escriban sus narraciones siguiendo su plan.",
      "Permitir que algunos voluntarios compartan sus narraciones con la clase."
    ],
    assessment: "Rúbrica de evaluación que considere estructura narrativa, coherencia, creatividad y uso del lenguaje.",
    differentiation: "Proporcionar organizadores gráficos más detallados para estudiantes que requieren apoyo. Para estudiantes avanzados, sugerir la inclusión de diálogos y descripciones más elaboradas."
  },
  {
    title: "Experimento: Ciclo del agua en una bolsa",
    description: "Los estudiantes observarán una representación del ciclo del agua creando un modelo en una bolsa de plástico transparente.",
    objective: "Comprender los procesos de evaporación, condensación y precipitación mediante la observación directa de un modelo del ciclo del agua.",
    timeRequired: "30 minutos para la preparación, varios días para la observación",
    materials: [
      "Bolsas de plástico transparentes con cierre hermético",
      "Agua",
      "Colorante alimentario azul",
      "Cinta adhesiva",
      "Cuadernos de ciencias",
      "Lápices de colores"
    ],
    procedure: [
      "Explicar los componentes del ciclo del agua y su importancia.",
      "Añadir agua con colorante azul en las bolsas de plástico (aproximadamente 1/4 de la bolsa).",
      "Sellar las bolsas y colocarlas en una ventana soleada usando cinta adhesiva.",
      "Pedir a los estudiantes que observen y registren en sus cuadernos los cambios durante varios días.",
      "Guiar una discusión sobre cómo se relaciona el experimento con el ciclo del agua real.",
      "Solicitar a los estudiantes que dibujen y etiqueten el ciclo del agua basándose en sus observaciones."
    ],
    assessment: "Evaluación de los registros de observación y los diagramas del ciclo del agua realizados por los estudiantes.",
    differentiation: "Para estudiantes avanzados, solicitar la investigación de cómo el ciclo del agua afecta a diferentes ecosistemas. Para estudiantes que requieren apoyo, proporcionar una plantilla de registro con campos específicos para completar."
  }
]; 