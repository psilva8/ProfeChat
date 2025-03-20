import { NextRequest, NextResponse } from 'next/server';

const FLASK_PORT = process.env.FLASK_PORT || 5000;
const FLASK_URL = `http://localhost:${FLASK_PORT}`;

// Add logging to help debug the proxy
const logRequest = async (url: string, method: string) => {
    console.log(`[Proxy] ${method} request to: ${url}`);
    try {
        const response = await fetch(url);
        console.log(`[Proxy] Response status: ${response.status}`);
        return response;
    } catch (error) {
        console.error(`[Proxy] Error: ${error}`);
        throw error;
    }
};

export async function GET(request: NextRequest) {
    const { pathname, search } = new URL(request.url);
    const targetPath = pathname.replace('/api/proxy', '');
    const url = `${FLASK_URL}${targetPath}${search}`;
    
    try {
        const response = await logRequest(url, 'GET');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Proxy] Failed to reach Flask backend at ${url}:`, error);
        return NextResponse.json(
            { error: 'Failed to reach Flask backend' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const targetPath = pathname.replace('/api/proxy', '');
    const url = `${FLASK_URL}${targetPath}`;
    
    try {
        const body = await request.json();
        console.log(`[Proxy] POST request to ${url} with body:`, body);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        
        console.log(`[Proxy] Response status: ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Proxy] Failed to reach Flask backend at ${url}:`, error);
        return NextResponse.json(
            { error: 'Failed to reach Flask backend' },
            { status: 500 }
        );
    }
} 