'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const gradeOptions = [
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
];

const subjectOptions = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'language', label: 'Language Arts' },
  { value: 'science', label: 'Science' },
  { value: 'social_studies', label: 'Social Studies' },
];

export function LessonPlanForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    duration: '60',
    objectives: '',
  });
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo(null);

    try {
      console.log('Submitting lesson plan data:', formData);
      
      // Validate form data
      if (!formData.grade || !formData.subject || !formData.topic) {
        throw new Error('Please fill in all required fields');
      }
      
      // Add timestamp for debugging
      const requestTime = new Date().toISOString();
      setDebugInfo(`Request started at ${requestTime}`);

      const response = await fetch('/api/lesson-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setDebugInfo(prev => `${prev}\nResponse status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error generating lesson plan:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('You must be logged in to generate lesson plans');
        }
        
        throw new Error(errorData?.error || 'Failed to generate lesson plan');
      }

      const data = await response.json();
      setDebugInfo(prev => `${prev}\nResponse data received, ID: ${data.id?.substring(0, 10)}...`);
      
      toast.success('Lesson plan generated successfully');
      router.push(`/dashboard/lesson-plans/${data.id}`);
    } catch (error) {
      console.error('Failed to generate lesson plan:', error);
      setDebugInfo(prev => `${prev}\nError: ${error instanceof Error ? error.message : String(error)}`);
      toast.error(error instanceof Error ? error.message : 'An error occurred while generating the lesson plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            >
              <option value="">Select a grade</option>
              {gradeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            >
              <option value="">Select a subject</option>
              {subjectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              id="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              placeholder="E.g: Equivalent fractions"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="30"
              max="180"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
              Learning Objectives
            </label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the main objectives of the lesson"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
          </button>
        </div>
      </form>
      
      {debugInfo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md text-xs font-mono">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <pre className="whitespace-pre-wrap break-all">{debugInfo}</pre>
        </div>
      )}
    </>
  );
} 