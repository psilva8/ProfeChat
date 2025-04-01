'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface LessonPlan {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: number;
  objectives: string;
  content: {
    introduction: string;
    main_content: string;
    activities: string;
    assessment: string;
    closure: string;
  };
  created_at: string;
}

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessonPlans() {
      try {
        setDebugInfo(`Fetching lesson plans... ${new Date().toISOString()}`);
        
        // Use test-lesson-plans endpoint for testing without auth
        const response = await fetch('/api/test-lesson-plans', {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        setDebugInfo(prev => `${prev}\nResponse status: ${response.status}`);
        console.log('Response status:', response.status);
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        setDebugInfo(prev => `${prev}\nContent-Type: ${contentType}`);
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          setDebugInfo(prev => `${prev}\nNon-JSON response: ${text.substring(0, 100)}...`);
          console.error('Non-JSON response received:', text.substring(0, 100));
          throw new Error(`Expected JSON response but got ${contentType}`);
        }
        
        // Parse JSON only once
        let data: any;
        try {
          data = await response.json();
          setDebugInfo(prev => `${prev}\nResponse parsed successfully. Data type: ${typeof data}`);
          if (Array.isArray(data)) {
            setDebugInfo(prev => `${prev}\nData is an array with ${data.length} items`);
          } else {
            setDebugInfo(prev => `${prev}\nData is an object: ${JSON.stringify(data).substring(0, 100)}...`);
          }
        } catch (jsonError) {
          setDebugInfo(prev => `${prev}\nJSON parse error: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
          throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
        }
        
        if (!response.ok) {
          setDebugInfo(prev => `${prev}\nAPI error: ${data.error || response.statusText}`);
          throw new Error(`Failed to fetch lesson plans: ${data.error || response.statusText}`);
        }
        
        // Ensure data is in the expected format
        if (!Array.isArray(data)) {
          setDebugInfo(prev => `${prev}\nUnexpected response format: data is not an array`);
          if (data.success === false) {
            throw new Error(`API error: ${data.error || 'Unknown error'}`);
          }
          // Try to handle nested data structure
          if (data.lessonPlans && Array.isArray(data.lessonPlans)) {
            data = data.lessonPlans;
            setDebugInfo(prev => `${prev}\nUsing nested lessonPlans array with ${data.length} items`);
          } else {
            throw new Error('Unexpected response format: data is not an array and does not contain lessonPlans array');
          }
        }
        
        console.log('Lesson plans data:', data);
        setDebugInfo(prev => `${prev}\nSuccessfully loaded ${data.length} lesson plans`);
        setLessonPlans(data);
      } catch (err) {
        console.error('Error fetching lesson plans:', err);
        setError(err instanceof Error ? err.message : 'Error loading lesson plans');
        setDebugInfo(prev => `${prev}\nERROR: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLessonPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-accent-600 hover:text-accent-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lesson Plans</h1>
        <div className="flex space-x-2">
          <Link
            href="/test/create-lesson-plan"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Plan
          </Link>
          <Link
            href="/test/generate-plan"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Generate with AI
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <h3 className="font-medium">Error loading lesson plans</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {lessonPlans.length === 0 && !error ? (
        <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by creating a lesson plan or generating one with AI.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {lessonPlans.map((plan) => (
              <li key={plan.id}>
                <Link 
                  href={`/test/lesson-plan/${plan.id}`}
                  className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-accent-600 truncate">
                        {plan.topic}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        {plan.subject} • Grade {plan.grade}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {plan.objectives}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {plan.duration} minutes
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {debugInfo && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h3>
          <pre className="text-xs whitespace-pre-wrap text-gray-600">
            {debugInfo}
          </pre>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Looking for more features? <Link href="/auth/signin" className="text-accent-600 hover:text-accent-800">Sign in</Link> or <Link href="/auth/register" className="text-accent-600 hover:text-accent-800">create an account</Link> to access all tools.
        </p>
      </div>
    </div>
  );
} 