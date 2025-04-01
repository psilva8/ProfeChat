import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Sample lesson plan data for testing
const TEST_LESSON_PLANS = [
  {
    id: 'test-plan-1',
    grade: '8th Grade',
    duration: 60,
    created_at: '2023-03-30T14:30:00Z',
    subject: 'Math',
    content: {
      title: 'Introduction to Algebra',
      objectives: 'Students will be able to solve basic algebraic equations.',
      materials: 'Textbook, worksheets, calculators',
      introduction: 'Begin by reviewing the concept of variables.',
      activities: 'Group problem-solving, individual practice',
      assessment: 'Exit tickets, homework assignment',
      closure: 'Summary discussion and preview of next lesson'
    }
  },
  {
    id: 'test-plan-2',
    grade: '5th Grade',
    duration: 45,
    created_at: '2023-03-29T10:15:00Z',
    subject: 'Science',
    content: {
      title: 'The Water Cycle',
      objectives: 'Students will understand and explain the water cycle.',
      materials: 'Diagrams, video, demonstration materials',
      introduction: 'Ask students where rain comes from.',
      activities: 'Water cycle diagram, evaporation experiment',
      assessment: 'Create a water cycle poster',
      closure: 'Reflection on new learning'
    }
  },
  {
    id: 'test-plan-3',
    grade: '9th Grade',
    duration: 55,
    created_at: '2023-03-28T09:45:00Z',
    subject: 'English',
    content: {
      title: 'Shakespeare\'s Sonnets',
      objectives: 'Students will analyze the structure and themes of Shakespeare\'s sonnets.',
      materials: 'Sonnets handout, analysis worksheet',
      introduction: 'Brief history of sonnets and their structure.',
      activities: 'Read and annotate selected sonnets, small group discussions',
      assessment: 'Written analysis of one sonnet',
      closure: 'Share favorite lines and interpretations'
    }
  }
];

export async function GET(request: NextRequest) {
  console.log('Handling GET request to /api/lesson-plans');
  
  try {
    // For diagnostics purposes, always return test data
    // In a real app, this would check authentication and fetch from the database
    return NextResponse.json({ 
      success: true, 
      lesson_plans: TEST_LESSON_PLANS,
      message: 'Test data for diagnostic purposes'
    });
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch lesson plans',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('Handling POST request to /api/lesson-plans');
  
  try {
    // In a real app, this would check authentication and save to the database
    const data = await request.json();
    
    // For diagnostics, just echo the request back
    return NextResponse.json({
      success: true,
      message: 'Lesson plan created (test mode)',
      data: data
    });
  } catch (error) {
    console.error('Error creating lesson plan:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create lesson plan',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 