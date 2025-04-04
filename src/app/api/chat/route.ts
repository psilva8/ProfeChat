import { NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData } from '@/app/utils/api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('Handling chat request');
    const data = await request.json();
    const { message, subject } = data;

    console.log(`Chat request received: "${message.substring(0, 50)}..." on subject "${subject || 'none'}"`);

    if (!message) {
      console.log('Message is required but was empty');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if we should use test data (in production or if Flask is down)
    if (shouldUseTestData()) {
      console.log('Using test data for chat response');
      return NextResponse.json({
        response: `Este es un mensaje de prueba para la pregunta: "${message}".\n\nComo estamos en modo prueba, no estoy conectado al modelo de lenguaje completo. En producción, recibirías una respuesta personalizada basada en tu pregunta sobre ${subject || 'educación'}.`
      });
    }

    // Get Flask URL
    const flaskUrl = getFlaskUrl();
    if (!flaskUrl) {
      console.log('Flask URL not available, using test data');
      return NextResponse.json({
        response: 'El servidor de IA no está disponible en este momento. Por favor, intenta más tarde.'
      });
    }

    // Since the Flask server doesn't have a chat endpoint, use the generate-lesson endpoint
    // which is known to work based on previous logs
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
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
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
      
      // Format the response to look like a chat response
      let chatResponse = '';
      if (flaskData && flaskData.data) {
        chatResponse = flaskData.data;
      } else if (flaskData && flaskData.lesson_plan) {
        chatResponse = flaskData.lesson_plan;
      } else {
        chatResponse = 'Recibí una respuesta del servidor, pero no pude extraer el contenido en el formato esperado.';
      }
      
      return NextResponse.json({ response: chatResponse });
    } catch (error) {
      console.error('Error communicating with Flask API:', error);
      return NextResponse.json({
        response: 'Error al comunicarse con el servidor de IA. Por favor, intenta de nuevo más tarde.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({
      response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 });
  }
} 