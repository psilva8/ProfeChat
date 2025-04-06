'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Resource data for the page
const resourceCategories = [
  {
    id: 'lesson-plans',
    title: 'Lesson Plans',
    description: 'Detailed lesson plans for various subjects and grade levels.',
    icon: '📝',
    color: 'bg-blue-100',
    resources: [
      { title: 'Fractions for Grade 5', subject: 'Math', grade: '5' },
      { title: 'Parts of Speech', subject: 'Language Arts', grade: '3-5' },
      { title: 'The Water Cycle', subject: 'Science', grade: '4' },
      { title: 'Colonial America', subject: 'Social Studies', grade: '5' }
    ]
  },
  {
    id: 'activities',
    title: 'Classroom Activities',
    description: 'Engaging activities to enhance learning and participation.',
    icon: '🎯',
    color: 'bg-green-100',
    resources: [
      { title: 'Fraction Dice Games', subject: 'Math', grade: '3-5' },
      { title: 'Creative Writing Prompts', subject: 'Language Arts', grade: 'All' },
      { title: 'Simple Machines Exploration', subject: 'Science', grade: '3-4' },
      { title: 'Historical Timeline Activity', subject: 'Social Studies', grade: '4-6' }
    ]
  },
  {
    id: 'worksheets',
    title: 'Printable Worksheets',
    description: 'Ready-to-use worksheets for practice and assessment.',
    icon: '📄',
    color: 'bg-yellow-100',
    resources: [
      { title: 'Addition and Subtraction', subject: 'Math', grade: 'K-2' },
      { title: 'Sight Words Practice', subject: 'Language Arts', grade: 'K-1' },
      { title: 'Animal Classification', subject: 'Science', grade: '2-3' },
      { title: 'Map Skills', subject: 'Social Studies', grade: '3-5' }
    ]
  },
  {
    id: 'assessments',
    title: 'Assessments & Rubrics',
    description: 'Tools to evaluate student understanding and progress.',
    icon: '📊',
    color: 'bg-red-100',
    resources: [
      { title: 'Math Skills Assessment', subject: 'Math', grade: '3-5' },
      { title: 'Reading Comprehension Test', subject: 'Language Arts', grade: '4-6' },
      { title: 'Science Project Rubric', subject: 'Science', grade: 'All' },
      { title: 'History Essay Rubric', subject: 'Social Studies', grade: '6-8' }
    ]
  },
  {
    id: 'videos',
    title: 'Educational Videos',
    description: 'Visual learning resources for classroom or remote instruction.',
    icon: '🎬',
    color: 'bg-purple-100',
    resources: [
      { title: 'Introduction to Fractions', subject: 'Math', grade: '3-5' },
      { title: 'Grammar Basics', subject: 'Language Arts', grade: '4-6' },
      { title: 'The Solar System', subject: 'Science', grade: 'All' },
      { title: 'Ancient Civilizations', subject: 'Social Studies', grade: '6-8' }
    ]
  },
  {
    id: 'interactive',
    title: 'Interactive Tools',
    description: 'Digital tools and interactives for engaged learning.',
    icon: '💻',
    color: 'bg-indigo-100',
    resources: [
      { title: 'Fraction Calculator', subject: 'Math', grade: '3-8' },
      { title: 'Sentence Diagramming Tool', subject: 'Language Arts', grade: '4-8' },
      { title: 'Virtual Lab Simulations', subject: 'Science', grade: '5-8' },
      { title: 'Interactive Timeline Creator', subject: 'Social Studies', grade: 'All' }
    ]
  }
];

// Filter categories for search functionality
const allSubjects = ['All', 'Math', 'Science', 'Language Arts', 'Social Studies', 'Art', 'Music', 'Physical Education'];
const allGradeLevels = ['All', 'K-2', '3-5', '6-8', '9-12'];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  
  // Filter resources based on search and filters
  const filteredCategories = resourceCategories.map(category => {
    const filteredResources = category.resources.filter(resource => {
      const matchesSearch = searchTerm === '' || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
      const matchesGrade = selectedGrade === 'All' || resource.grade === selectedGrade || resource.grade === 'All';
      
      return matchesSearch && matchesSubject && matchesGrade;
    });
    
    return {
      ...category,
      resources: filteredResources,
      hasMatches: filteredResources.length > 0
    };
  }).filter(category => category.hasMatches || searchTerm === '');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Educational Resources</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium">Search Resources</label>
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Filter by Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Filter by Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {allGradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">No resources match your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('All');
              setSelectedGrade('All');
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${category.color} p-6`}>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                <p className="text-gray-700">{category.description}</p>
                <Link 
                  href={`/resources/${category.id}`}
                  className="inline-block mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  View All {category.title}
                </Link>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Featured Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.resources.slice(0, 4).map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h4 className="font-medium">{resource.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {resource.subject}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Grade: {resource.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 flex justify-center">
        <Link 
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}