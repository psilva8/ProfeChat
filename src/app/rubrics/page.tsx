'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Rubric {
  id: string;
  title: string;
  grade: string;
  subject: string;
  criteria: Array<{
    name: string;
    description: string;
  }>;
}

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch('/api/rubrics');
        if (!response.ok) {
          throw new Error('Failed to fetch rubrics');
        }
        const data = await response.json();
        setRubrics(data);
      } catch (error) {
        toast.error('Error loading rubrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRubrics();
  }, []);

  const handleRubricClick = (rubric: Rubric) => {
    router.push(`/dashboard/rubrics/${rubric.id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rubrics</h1>
      <div className="grid gap-4">
        {rubrics.map((rubric: Rubric) => (
          <div key={rubric.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{rubric.title}</h2>
            <p className="text-gray-600">{rubric.grade} - {rubric.subject}</p>
            <div className="mt-2">
              <h3 className="font-medium">Criteria:</h3>
              <ul className="list-disc list-inside">
                {rubric.criteria.map((criterion: { name: string }, index: number) => (
                  <li key={index}>{criterion.name}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleRubricClick(rubric)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 