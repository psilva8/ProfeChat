'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

export default function LessonPlanDetailPage({ params }: { params: { id: string } }) {
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLessonPlan() {
      try {
        // Get all plans and find the one with matching ID
        const response = await fetch('/api/test-lesson-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch lesson plans');
        }
        
        const plans = await response.json();
        const foundPlan = plans.find((p: LessonPlan) => p.id === params.id);
        
        if (!foundPlan) {
          throw new Error('Lesson plan not found');
        }
        
        setPlan(foundPlan);
      } catch (err) {
        console.error('Error fetching lesson plan:', err);
        setError(err instanceof Error ? err.message : 'Error loading lesson plan');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLessonPlan();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || 'Lesson plan not found'}
        </div>
        <div className="mt-4">
          <Link
            href="/test/lesson-plans"
            className="text-accent-600 hover:text-accent-800"
          >
            Back to Lesson Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/test/lesson-plans"
          className="inline-flex items-center text-accent-600 hover:text-accent-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Lesson Plans
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{plan.topic}</h1>
            <div className="flex flex-wrap mt-2 gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                {plan.subject}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                {plan.grade}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                {plan.duration} minutes
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Objectives</h2>
            <p className="text-gray-700">{plan.objectives}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Introduction</h2>
              <p className="text-gray-700">{plan.content.introduction}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Main Content</h2>
              <p className="text-gray-700">{plan.content.main_content}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Activities</h2>
              <p className="text-gray-700">{plan.content.activities}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Assessment</h2>
              <p className="text-gray-700">{plan.content.assessment}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Closure</h2>
              <p className="text-gray-700">{plan.content.closure}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 text-right">
          <p className="text-sm text-gray-500">
            Created on {new Date(plan.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 