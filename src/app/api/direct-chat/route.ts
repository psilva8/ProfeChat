import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('DIRECT chat API called - bypassing all other APIs');
    
    const data = await request.json();
    const { message, subject } = data;

    console.log(`DIRECT chat request for: "${message.substring(0, 50)}..."`);

    if (!message) {
      console.log('Message is required but was empty');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get Flask URL directly
    const flaskUrl = getDirectFlaskUrl();
    console.log(`Directly connecting to Flask at ${flaskUrl}`);
    
    if (!flaskUrl) {
      console.error('Could not determine Flask URL');
      return NextResponse.json({
        response: 'El servidor de IA no está disponible en este momento. Por favor, intenta más tarde.'
      }, { status: 500 });
    }

    // Connect directly to Flask using the generate-lesson endpoint
    console.log(`Making direct request to ${flaskUrl}/api/generate-lesson`);
    
    try {
      const response = await fetch(`${flaskUrl}/api/generate-lesson`, {
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
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Flask error: ${response.status}`, errorText);
        return NextResponse.json({
          response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
        }, { status: 500 });
      }

      const responseData = await response.json();
      console.log('Successfully received data from Flask');
      
      let chatResponse = '';
      if (responseData.lesson_plan) {
        chatResponse = responseData.lesson_plan;
      } else if (responseData.data) {
        chatResponse = responseData.data;
      } else {
        chatResponse = JSON.stringify(responseData);
      }
      
      return NextResponse.json({ response: chatResponse });
    } catch (error) {
      console.error('Error connecting to Flask:', error);
      return NextResponse.json({
        response: 'Error al comunicarse con el servidor de IA. Por favor, intenta de nuevo más tarde.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in direct-chat API:', error);
    return NextResponse.json({
      response: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.'
    }, { status: 500 });
  }
}

// Simple function to get Flask URL directly
function getDirectFlaskUrl(): string {
  try {
    // Try to read from .flask-port file
    const portFile = path.join(process.cwd(), '.flask-port');
    if (fs.existsSync(portFile)) {
      const portContent = fs.readFileSync(portFile, 'utf8').trim();
      const port = parseInt(portContent, 10);
      if (!isNaN(port) && port > 0 && port < 65536) {
        return `http://localhost:${port}`;
      }
    }
    
    // Default to port 5338
    return 'http://localhost:5338';
  } catch (error) {
    console.error('Error reading .flask-port file:', error);
    return '';
  }
} 