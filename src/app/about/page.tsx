'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">About ProfeChat</h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            ProfeChat is dedicated to empowering educators with AI-powered tools that save time, enhance teaching, and improve learning outcomes for students across all subjects and grade levels.
          </p>
        </div>
        
        <div className="p-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="mb-4">
              ProfeChat was developed by a team of passionate educators, technologists, and AI specialists who believe that artificial intelligence can transform education for the better.
            </p>
            <p>
              Our platform combines cutting-edge AI technology with deep educational expertise to create tools that truly understand the needs of teachers and students.
            </p>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Lesson Planner</h3>
                <p>Create comprehensive, standards-aligned lesson plans in seconds for any subject and grade level.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Activity Generator</h3>
                <p>Generate engaging classroom activities tailored to your curriculum needs and student abilities.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Educational Resources</h3>
                <p>Access a growing library of worksheets, assessments, videos, and other teaching materials.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Subject-Specific Tools</h3>
                <p>Explore specialized resources organized by subject area to support targeted instruction.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              We envision a world where teachers spend less time on repetitive tasks and more time doing what they do best: inspiring, mentoring, and connecting with their students. By leveraging AI to handle the routine aspects of lesson preparation, assessment creation, and resource gathering, we aim to give educators back their most precious resource—time.
            </p>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <span className="font-medium">Input your parameters:</span> Select your subject, grade level, topic, and any specific requirements.
              </li>
              <li>
                <span className="font-medium">Generate content:</span> Our AI creates personalized lesson plans, activities, or resources based on your specifications.
              </li>
              <li>
                <span className="font-medium">Review and customize:</span> Make any adjustments to perfectly fit your teaching style and classroom needs.
              </li>
              <li>
                <span className="font-medium">Download and use:</span> Save your generated content for immediate use in your classroom.
              </li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
            <p className="mb-6">
              Join thousands of educators who are already saving time and creating better learning experiences with ProfeChat's AI-powered tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/lesson-planner"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Lesson Planner
              </Link>
              
              <Link 
                href="/activity-planner"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Generate Activities
              </Link>
              
              <Link 
                href="/subjects"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Explore Subjects
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 