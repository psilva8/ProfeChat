import { NextRequest, NextResponse } from 'next/server';
import { getCurriculumData, searchCurriculum } from '@/services/curriculumService';

/**
 * GET handler for curriculum API
 * Serves parsed curriculum data from the Peruvian National Curriculum PDF
 * Query parameters:
 * - query: Optional search query to filter curriculum content 
 * - grade: Optional grade level filter (INICIAL, PRIMARIA, SECUNDARIA)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('query') || '';
    const gradeLevel = searchParams.get('grade') || '';
    
    // CORS headers for preflight requests
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    let curriculumData;
    
    // If search query provided, filter curriculum data
    if (searchQuery || gradeLevel) {
      curriculumData = await searchCurriculum(searchQuery, gradeLevel);
    } else {
      // Otherwise return all curriculum data
      curriculumData = await getCurriculumData();
    }
    
    return NextResponse.json(
      { 
        success: true, 
        data: curriculumData 
      },
      { headers }
    );
  } catch (error) {
    console.error('Error serving curriculum data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve curriculum data'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
} 