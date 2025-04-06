'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Subject metadata for display purposes
const subjectData = {
  'mathematics': {
    name: 'Mathematics',
    icon: '📊',
    color: 'bg-blue-100',
    description: 'Explore mathematical concepts, from basic arithmetic to advanced algebra.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Numbers & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis', 'Fractions']
  },
  'science': {
    name: 'Science',
    icon: '🔬',
    color: 'bg-green-100',
    description: 'Discover the natural world through scientific inquiry and experimentation.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Life Science', 'Earth Science', 'Physical Science', 'Biology', 'Chemistry', 'Physics']
  },
  'language': {
    name: 'Language Arts',
    icon: '📝',
    color: 'bg-yellow-100',
    description: 'Develop reading, writing, speaking, and listening skills.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Reading', 'Writing', 'Grammar', 'Vocabulary', 'Literature', 'Communication']
  },
  'social-studies': {
    name: 'Social Studies',
    icon: '🌎',
    color: 'bg-orange-100',
    description: 'Explore history, geography, economics, and civics.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['History', 'Geography', 'Civics', 'Economics', 'World Cultures', 'Current Events']
  },
  'art': {
    name: 'Art',
    icon: '🎨',
    color: 'bg-pink-100',
    description: 'Express creativity through various art forms and media.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Drawing', 'Painting', 'Sculpture', 'Art History', 'Digital Art', 'Mixed Media']
  },
  'music': {
    name: 'Music',
    icon: '🎵',
    color: 'bg-purple-100',
    description: 'Discover musical concepts, instruments, and composition.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Rhythm', 'Melody', 'Harmony', 'Instruments', 'Music History', 'Composition']
  },
  'physical-education': {
    name: 'Physical Education',
    icon: '⚽',
    color: 'bg-red-100',
    description: 'Develop physical fitness, movement skills, and healthy habits.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Movement Skills', 'Team Sports', 'Individual Sports', 'Fitness', 'Health', 'Nutrition']
  },
  'computer-science': {
    name: 'Computer Science',
    icon: '💻',
    color: 'bg-indigo-100',
    description: 'Learn programming, algorithms, and computational thinking.',
    grades: ['K-2', '3-5', '6-8', '9-12'],
    topics: ['Programming', 'Algorithms', 'Data Structures', 'Web Development', 'Robotics', 'Artificial Intelligence']
  }
};

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const subject = params.subject;
  const subjectInfo = subjectData[subject as keyof typeof subjectData];
  
  if (!subjectInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Subject Not Found</h1>
        <p className="mb-8">The subject you're looking for doesn't exist.</p>
        <Link 
          href="/subjects"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Subjects
        </Link>
      </div>
    );
  }

  const handleGenerateLessonPlan = () => {
    if (!selectedGrade || !selectedTopic) {
      alert('Please select both a grade level and topic');
      return;
    }
    // Navigate to the lesson plan generator with the selected parameters
    window.location.href = `/lesson-planner?subject=${subject}&grade=${selectedGrade}&topic=${selectedTopic}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${subjectInfo.color} p-8 rounded-lg shadow-md mb-8`}>
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">{subjectInfo.icon}</span>
          <h1 className="text-3xl font-bold">{subjectInfo.name}</h1>
        </div>
        <p className="text-lg mb-4">{subjectInfo.description}</p>
        
        <div className="mt-6">
          <Link 
            href="/subjects"
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mr-4"
          >
            ← Back to Subjects
          </Link>
          
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Home
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Grade Levels</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjectInfo.grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`p-3 rounded-lg border transition-colors duration-200 ${
                  selectedGrade === grade 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white hover:bg-gray-100 border-gray-300'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Topics</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjectInfo.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`p-3 rounded-lg border transition-colors duration-200 ${
                  selectedTopic === topic 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white hover:bg-gray-100 border-gray-300'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-12">
        <h2 className="text-2xl font-semibold mb-4">Create Lesson Plan</h2>
        <p className="mb-6">
          Select a grade level and topic above, then click the button below to generate a custom lesson plan.
        </p>
        <button
          onClick={handleGenerateLessonPlan}
          disabled={!selectedGrade || !selectedTopic}
          className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 ${
            !selectedGrade || !selectedTopic
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Generate Lesson Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Popular Resources</h2>
          <ul className="space-y-3">
            <li>
              <Link href={`/subjects/${subject}/resources/standards`} className="text-blue-600 hover:underline">
                Curriculum Standards
              </Link>
            </li>
            <li>
              <Link href={`/subjects/${subject}/resources/worksheets`} className="text-blue-600 hover:underline">
                Printable Worksheets
              </Link>
            </li>
            <li>
              <Link href={`/subjects/${subject}/resources/assessments`} className="text-blue-600 hover:underline">
                Assessment Tools
              </Link>
            </li>
            <li>
              <Link href={`/subjects/${subject}/resources/videos`} className="text-blue-600 hover:underline">
                Instructional Videos
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Lesson Plans</h2>
          <p className="text-gray-600">
            No recent lesson plans for this subject. Generate a new one to see it here!
          </p>
        </div>
      </div>
    </div>
  );
} 