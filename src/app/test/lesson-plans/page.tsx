'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

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

export default function TestLessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLessonPlans() {
      try {
        // Using the proxy endpoint which is more reliable
        const response = await fetch('/api/proxy/test-lesson-plans');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(`Failed to fetch lesson plans: ${data.error || response.statusText}`);
        }
        const data = await response.json();
        setLessonPlans(data);
      } catch (err) {
        console.error('Error fetching lesson plans:', err);
        setError(err instanceof Error ? err.message : 'Error loading lesson plans');
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

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Lesson Plans</h1>
        <Link
          href="/test/create-lesson-plan"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Test Plan
        </Link>
      </div>

      {lessonPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by creating a test lesson plan.
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
    </div>
  );
} 