import { NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData, isBuildEnvironment } from '@/app/utils/api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('Handling chat request');
    console.log(`Current environment: ${process.env.NODE_ENV}`);
    console.log(`Is build environment: ${isBuildEnvironment()}`);
    
    const data = await request.json();
    const { message, subject } = data;

    console.log(`Chat request received: "${message.substring(0, 50)}..." on subject "${subject || 'none'}"`);

    if (!message) {
      console.log('Message is required but was empty');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // In development, ALWAYS try to use the real API
    if (process.env.NODE_ENV === 'development') {
      console.log('In development mode, attempting to use real API');
      return await generateFromFlask(message, subject);
    }

    // If not in development, check if we should use test data
    const useTestData = shouldUseTestData();
    console.log(`Should use test data? ${useTestData ? 'Yes' : 'No'}`);
    
    if (useTestData) {
      console.log('Using test data for chat response');
      return NextResponse.json({
        response: `Este es un mensaje de prueba para la pregunta: "${message}".\n\nComo estamos en modo prueba, no estoy conectado al modelo de lenguaje completo. En producción, recibirías una respuesta personalizada basada en tu pregunta sobre ${subject || 'educación'}.`
      });
    }

    // If we should not use test data, try the real API
    return await generateFromFlask(message, subject);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({
      response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 });
  }
}

// Helper function to generate response from Flask
async function generateFromFlask(message: string, subject: string | undefined) {
  // Get Flask URL
  const flaskUrl = getFlaskUrl();
  console.log(`Flask URL: ${flaskUrl}`);
  
  if (!flaskUrl) {
    console.log('Flask URL not available, returning error');
    return NextResponse.json({
      response: 'El servidor de IA no está disponible en este momento. Por favor, intenta más tarde.'
    });
  }

  // Since the Flask server doesn't have a chat endpoint, use the generate-lesson endpoint
  console.log(`Forwarding chat request to Flask API using generate-lesson endpoint at ${flaskUrl}/api/generate-lesson`);
  try {
    const flaskResponse = await fetch(`${flaskUrl}/api/generate-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        subject: subject || 'General',
        grade: 'PRIMARIA',
        topic: message,
        objectives: 'Responder a la consulta del usuario',
        duration: '30 minutos'
      }),
      // Add a reasonable timeout
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      console.error(`Flask API returned an error (${flaskResponse.status}):`, errorText);
      return NextResponse.json({
        response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
      }, { status: 500 });
    }

    const flaskData = await flaskResponse.json();
    console.log('Received successful response from Flask API');
    console.log(`Response data keys: ${Object.keys(flaskData).join(', ')}`);
    
    // Format the response to look like a chat response
    let chatResponse = '';
    if (flaskData && flaskData.data) {
      console.log('Using data field from response');
      chatResponse = flaskData.data;
    } else if (flaskData && flaskData.lesson_plan) {
      console.log('Using lesson_plan field from response');
      chatResponse = flaskData.lesson_plan;
    } else {
      console.log('Could not find expected data format, using raw response');
      chatResponse = 'Recibí una respuesta del servidor, pero no pude extraer el contenido en el formato esperado.';
    }
    
    return NextResponse.json({ response: chatResponse });
  } catch (error) {
    console.error('Error communicating with Flask API:', error);
    return NextResponse.json({
      response: 'Error al comunicarse con el servidor de IA. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 });
  }
} 