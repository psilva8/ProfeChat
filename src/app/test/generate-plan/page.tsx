'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GeneratePlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: 45,
    objectives: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }

      const data = await response.json();
      if (data.success) {
        // Redirect to view all plans after successful generation
        router.push('/test/lesson-plans');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate lesson plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Generate Lesson Plan with AI</h1>
        <Link 
          href="/test/lesson-plans"
          className="text-accent-600 hover:text-accent-800">
          View All Lesson Plans
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            required
            value={formData.grade}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            value={formData.topic}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            required
            min={1}
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
            Learning Objectives
          </label>
          <textarea
            id="objectives"
            name="objectives"
            rows={3}
            value={formData.objectives}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                Generating...
              </>
            ) : (
              'Generate Lesson Plan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 