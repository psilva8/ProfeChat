'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

const subjects = [
  { id: 'mathematics', name: 'Mathematics', icon: '📊', color: 'bg-blue-100' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-green-100' },
  { id: 'language', name: 'Language Arts', icon: '📝', color: 'bg-yellow-100' },
  { id: 'social-studies', name: 'Social Studies', icon: '🌎', color: 'bg-orange-100' },
  { id: 'art', name: 'Art', icon: '🎨', color: 'bg-pink-100' },
  { id: 'music', name: 'Music', icon: '🎵', color: 'bg-purple-100' },
  { id: 'physical-education', name: 'Physical Education', icon: '⚽', color: 'bg-red-100' },
  { id: 'computer-science', name: 'Computer Science', icon: '💻', color: 'bg-indigo-100' },
];

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Educational Subjects</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search subjects..."
          className="w-full p-3 border rounded-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSubjects.map((subject) => (
          <Link 
            key={subject.id} 
            href={`/subjects/${subject.id}`}
            className={`${subject.color} p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl mb-3">{subject.icon}</span>
              <h2 className="text-xl font-semibold">{subject.name}</h2>
              <p className="mt-2 text-gray-600">Explore {subject.name.toLowerCase()} lessons and resources</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 