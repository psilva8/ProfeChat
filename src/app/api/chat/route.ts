import { NextResponse } from 'next/server';
import { getFlaskUrl, shouldUseTestData } from '@/app/utils/api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { message, subject } = data;

    if (!message) {
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

    // Forward to Flask API
    console.log(`Forwarding chat request to Flask API at ${flaskUrl}/api/chat`);
    const flaskResponse = await fetch(`${flaskUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message, 
        subject: subject || '' 
      }),
    });

    if (!flaskResponse.ok) {
      console.error('Flask API returned an error', await flaskResponse.text());
      return NextResponse.json({
        response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
      }, { status: 500 });
    }

    const flaskData = await flaskResponse.json();
    return NextResponse.json(flaskData);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({
      response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 });
  }
} 