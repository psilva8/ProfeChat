'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch('/api/rubrics');
        if (!response.ok) {
          throw new Error('Failed to fetch rubrics');
        }
        const data = await response.json();
        setRubrics(data);
      } catch {
        toast.error('Failed to load rubrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRubrics();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rubrics</h1>
      <div className="grid gap-4">
        {rubrics.map((rubric: any) => (
          <div key={rubric.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{rubric.title}</h2>
            <p className="text-gray-600">{rubric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 