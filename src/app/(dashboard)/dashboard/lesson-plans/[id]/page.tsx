'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface LessonPlan {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: number;
  objectives: string;
  content: string;
  createdAt: string;
}

export default function LessonPlanPage() {
  const params = useParams();
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLessonPlan() {
      if (!params?.id) {
        setError('Invalid lesson plan ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/lesson-plans/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson plan');
        }
        const data = await response.json();
        setLessonPlan(data);
      } catch (err) {
        console.error('Error fetching lesson plan:', err);
        setError(err instanceof Error ? err.message : 'Error loading lesson plan');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLessonPlan();
  }, [params?.id]);

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

  if (!lessonPlan) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          Lesson plan not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {lessonPlan.topic}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {lessonPlan.subject} • Grade {lessonPlan.grade} • {lessonPlan.duration} minutes
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Learning Objectives</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lessonPlan.objectives}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Content</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {lessonPlan.content}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created On</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(lessonPlan.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 