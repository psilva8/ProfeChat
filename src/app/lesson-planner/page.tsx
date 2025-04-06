'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LessonPlannerContent() {
  const searchParams = useSearchParams();
  
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [grade, setGrade] = useState(searchParams.get('grade') || '');
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [competency, setCompetency] = useState('');
  const [lessonDuration, setLessonDuration] = useState(60);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('form');
  
  useEffect(() => {
    // Auto-generate if all required parameters are provided in URL
    if (subject && grade && topic) {
      generateLessonPlan();
    }
  }, []);
  
  const generateLessonPlan = async () => {
    if (!subject || !grade || !topic) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setActiveTab('result');
    
    try {
      console.log(`Generating lesson plan for ${subject}, ${grade}, ${topic}`);
      
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          competency: competency || undefined,
          duration: lessonDuration || undefined
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate lesson plan');
      }
      
      const data = await response.json();
      console.log('Lesson plan data:', data);
      
      // Handle different response formats
      if (data.lesson_plan) {
        if (typeof data.lesson_plan === 'string') {
          setLessonPlan({
            title: `${topic} - ${grade} - ${subject}`,
            content: data.lesson_plan,
            isMarkdown: true
          });
        } else {
          setLessonPlan(data.lesson_plan);
        }
      } else if (data.data) {
        setLessonPlan(data.data);
      } else {
        setLessonPlan({
          title: `${topic} - ${grade} - ${subject}`,
          content: JSON.stringify(data),
          isMarkdown: false
        });
      }
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateLessonPlan();
  };
  
  const saveAsPDF = () => {
    alert('PDF export functionality would be implemented here');
    // In a real implementation, this would generate a PDF from the lesson plan
  };
  
  const renderLessonPlanContent = () => {
    if (!lessonPlan) return null;
    
    if (lessonPlan.isMarkdown) {
      // For markdown content, we could use a library like react-markdown
      // For simplicity, we'll just render it with basic formatting
      return (
        <div className="whitespace-pre-wrap">
          {lessonPlan.content}
        </div>
      );
    }
    
    // Render structured lesson plan
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{lessonPlan.title || 'Lesson Plan'}</h2>
        
        {lessonPlan.objectives && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Learning Objectives</h3>
            <ul className="list-disc pl-6 space-y-1">
              {Array.isArray(lessonPlan.objectives) 
                ? lessonPlan.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)
                : <li>{lessonPlan.objectives}</li>
              }
            </ul>
          </div>
        )}
        
        {lessonPlan.materials && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Materials</h3>
            <ul className="list-disc pl-6 space-y-1">
              {Array.isArray(lessonPlan.materials)
                ? lessonPlan.materials.map((mat: string, i: number) => <li key={i}>{mat}</li>)
                : <li>{lessonPlan.materials}</li>
              }
            </ul>
          </div>
        )}
        
        {(lessonPlan.procedure || lessonPlan.activities) && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Procedure</h3>
            <ol className="list-decimal pl-6 space-y-2">
              {Array.isArray(lessonPlan.procedure || lessonPlan.activities)
                ? (lessonPlan.procedure || lessonPlan.activities).map((step: string, i: number) => (
                    <li key={i} className="pl-2">{step}</li>
                  ))
                : <li className="pl-2">{lessonPlan.procedure || lessonPlan.activities}</li>
              }
            </ol>
          </div>
        )}
        
        {lessonPlan.assessment && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Assessment</h3>
            <div className="pl-4">
              {typeof lessonPlan.assessment === 'string' 
                ? lessonPlan.assessment 
                : JSON.stringify(lessonPlan.assessment)
              }
            </div>
          </div>
        )}
        
        {lessonPlan.extensions && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Extensions/Homework</h3>
            <div className="pl-4">
              {typeof lessonPlan.extensions === 'string'
                ? lessonPlan.extensions
                : JSON.stringify(lessonPlan.extensions)
              }
            </div>
          </div>
        )}
        
        {lessonPlan.content && (
          <div className="mb-6">
            <div className="whitespace-pre-wrap">{lessonPlan.content}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Lesson Planner</h1>
      
      <div className="mb-8">
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'form' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('form')}
          >
            Planner Form
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'result' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('result')}
            disabled={!lessonPlan && !isGenerating}
          >
            Generated Lesson
          </button>
        </div>
      </div>
      
      {activeTab === 'form' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., Mathematics"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Grade Level *</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., 3-5"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">Topic *</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="E.g., Fractions"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Competency</label>
                <input
                  type="text"
                  value={competency}
                  onChange={(e) => setCompetency(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="E.g., Problem solving"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                  min="15"
                  max="180"
                />
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isGenerating}
                className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 ${
                  isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Lesson Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {activeTab === 'result' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isGenerating ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-lg">Generating your lesson plan...</p>
              <p className="text-gray-500 text-sm mt-2">This may take up to 15-30 seconds.</p>
            </div>
          ) : lessonPlan ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Generated Lesson Plan</h2>
                <div>
                  <button
                    onClick={saveAsPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 mr-2"
                  >
                    Save as PDF
                  </button>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit Parameters
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                {renderLessonPlanContent()}
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Link 
                  href={`/subjects/${subject.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-600 hover:underline"
                >
                  ← Back to {subject}
                </Link>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              <p className="font-medium">Error generating lesson plan:</p>
              <p>{error}</p>
              <button
                onClick={() => setActiveTab('form')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Back to Form
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg">No lesson plan generated yet.</p>
              <button
                onClick={() => setActiveTab('form')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Go to Form
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function LessonPlannerLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Lesson Planner</h1>
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-lg">Loading lesson planner...</p>
      </div>
    </div>
  );
}

export default function LessonPlanner() {
  return (
    <Suspense fallback={<LessonPlannerLoading />}>
      <LessonPlannerContent />
    </Suspense>
  );
} 