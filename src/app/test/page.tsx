'use client';

import Link from 'next/link';

export default function TestIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Dashboard</h1>
        
        <p className="text-gray-600 mb-8">
          This area provides test pages that don't require authentication. These pages are meant for testing purposes only.
        </p>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/test/lesson-plans"
            className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lesson Plans</h2>
            <p className="text-gray-600">View all lesson plans created for the test user</p>
          </Link>
          
          <Link 
            href="/test/create-lesson-plan"
            className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Plan</h2>
            <p className="text-gray-600">Create a basic lesson plan manually</p>
          </Link>
          
          <Link 
            href="/test/generate-plan"
            className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Generate</h2>
            <p className="text-gray-600">Generate a lesson plan using AI</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 