import { NextRequest, NextResponse } from 'next/server';
import { getFlaskUrl } from '@/utils/api';

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
    
    // Get the Flask URL from the utility function
    const flaskUrl = getFlaskUrl();
    
    if (!flaskUrl) {
        console.warn('[Proxy] No Flask URL available, cannot connect to Flask backend');
        return NextResponse.json(
            { 
                success: false,
                error: 'Flask backend not available',
                message: 'Unable to connect to the Flask backend. The service may be in maintenance mode.'
            },
            { status: 503 }
        );
    }
    
    const url = `${flaskUrl}${targetPath}${search}`;
    
    try {
        const response = await logRequest(url, 'GET');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Proxy] Failed to reach Flask backend at ${url}:`, error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to reach Flask backend',
                message: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const targetPath = pathname.replace('/api/proxy', '');
    
    // Get the Flask URL from the utility function
    const flaskUrl = getFlaskUrl();
    
    if (!flaskUrl) {
        console.warn('[Proxy] No Flask URL available, cannot connect to Flask backend');
        return NextResponse.json(
            { 
                success: false,
                error: 'Flask backend not available',
                message: 'Unable to connect to the Flask backend. The service may be in maintenance mode.'
            },
            { status: 503 }
        );
    }
    
    const url = `${flaskUrl}${targetPath}`;
    
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
            { 
                success: false,
                error: 'Failed to reach Flask backend',
                message: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 