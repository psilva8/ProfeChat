'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateLessonPlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: 45,
    objectives: '',
    content: {
      introduction: '',
      main_content: '',
      activities: '',
      assessment: '',
      closure: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested content fields (e.g., content.introduction)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: name === 'duration' ? parseInt(value, 10) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Generate a unique ID for the test plan
      const testId = `manual-plan-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      // Prepare data in the format expected by the API
      const planData = {
        ...formData,
        id: testId,
        created_at: timestamp
      };

      // Save the plan by adding it to the test-lesson-plans list
      const response = await fetch('/api/proxy/test-create-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson plan');
      }

      // Redirect to the lesson plans list on success
      router.push('/test/lesson-plans');
    } catch (err) {
      console.error('Error creating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to create lesson plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Test Lesson Plan</h1>
        <Link
          href="/test/lesson-plans"
          className="text-accent-600 hover:text-accent-800"
        >
          Back to Lesson Plans
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
            Objectives
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Content</h3>
          
          <div>
            <label htmlFor="content.introduction" className="block text-sm font-medium text-gray-700">
              Introduction
            </label>
            <textarea
              id="content.introduction"
              name="content.introduction"
              rows={2}
              value={formData.content.introduction}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label htmlFor="content.main_content" className="block text-sm font-medium text-gray-700">
              Main Content
            </label>
            <textarea
              id="content.main_content"
              name="content.main_content"
              rows={3}
              value={formData.content.main_content}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label htmlFor="content.activities" className="block text-sm font-medium text-gray-700">
              Activities
            </label>
            <textarea
              id="content.activities"
              name="content.activities"
              rows={2}
              value={formData.content.activities}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label htmlFor="content.assessment" className="block text-sm font-medium text-gray-700">
              Assessment
            </label>
            <textarea
              id="content.assessment"
              name="content.assessment"
              rows={2}
              value={formData.content.assessment}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label htmlFor="content.closure" className="block text-sm font-medium text-gray-700">
              Closure
            </label>
            <textarea
              id="content.closure"
              name="content.closure"
              rows={2}
              value={formData.content.closure}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                Saving...
              </>
            ) : (
              'Create Lesson Plan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 