'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Resource category data
const resourceData = {
  'lesson-plans': {
    title: 'Lesson Plans',
    description: 'Detailed lesson plans for various subjects and grade levels.',
    icon: '📝',
    color: 'bg-blue-100',
    resources: [
      { 
        id: 'fractions-grade-5',
        title: 'Fractions for Grade 5', 
        subject: 'Math', 
        grade: '5',
        description: 'A comprehensive lesson plan on understanding and working with fractions, including addition, subtraction, and comparison of fractions with different denominators.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'parts-of-speech',
        title: 'Parts of Speech', 
        subject: 'Language Arts', 
        grade: '3-5',
        description: 'Lesson plan focusing on identifying and using different parts of speech, with interactive activities and assessments.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'water-cycle',
        title: 'The Water Cycle', 
        subject: 'Science', 
        grade: '4',
        description: 'Engaging lesson on the water cycle, including evaporation, condensation, precipitation, and collection, with hands-on experiments.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'colonial-america',
        title: 'Colonial America', 
        subject: 'Social Studies', 
        grade: '5',
        description: 'A detailed study of Colonial America, examining daily life, governance, and the events leading to the American Revolution.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'multiplication-tables',
        title: 'Multiplication Tables', 
        subject: 'Math', 
        grade: '3-4',
        description: 'Structured lesson plan for teaching multiplication tables from 1-12, with games, worksheets, and assessment tools.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'photosynthesis',
        title: 'Photosynthesis Process', 
        subject: 'Science', 
        grade: '5-6',
        description: 'Comprehensive lesson on how plants make food through photosynthesis, with visual aids and a plant observation experiment.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'story-elements',
        title: 'Story Elements', 
        subject: 'Language Arts', 
        grade: '2-3',
        description: 'Lesson plan teaching the basic elements of a story including characters, setting, plot, conflict, and resolution.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'ancient-egypt',
        title: 'Ancient Egypt', 
        subject: 'Social Studies', 
        grade: '6',
        description: 'Exploration of Ancient Egyptian civilization, covering pyramids, pharaohs, daily life, and religious beliefs.',
        downloadUrl: '#',
        previewAvailable: true
      }
    ]
  },
  'activities': {
    title: 'Classroom Activities',
    description: 'Engaging activities to enhance learning and participation.',
    icon: '🎯',
    color: 'bg-green-100',
    resources: [
      { 
        id: 'fraction-dice-games',
        title: 'Fraction Dice Games', 
        subject: 'Math', 
        grade: '3-5',
        description: 'Fun dice games to practice comparing fractions, finding equivalent fractions, and adding fractions.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'creative-writing-prompts',
        title: 'Creative Writing Prompts', 
        subject: 'Language Arts', 
        grade: 'All',
        description: 'Collection of 50 creative writing prompts for various grade levels, organized by theme and complexity.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'simple-machines',
        title: 'Simple Machines Exploration', 
        subject: 'Science', 
        grade: '3-4',
        description: 'Hands-on activities exploring the six simple machines: lever, pulley, wheel and axle, inclined plane, wedge, and screw.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'historical-timeline',
        title: 'Historical Timeline Activity', 
        subject: 'Social Studies', 
        grade: '4-6',
        description: 'Interactive activity where students create a visual timeline of important historical events, with research and presentation components.',
        downloadUrl: '#',
        previewAvailable: true
      }
    ]
  },
  'worksheets': {
    title: 'Printable Worksheets',
    description: 'Ready-to-use worksheets for practice and assessment.',
    icon: '📄',
    color: 'bg-yellow-100',
    resources: [
      { 
        id: 'addition-subtraction',
        title: 'Addition and Subtraction', 
        subject: 'Math', 
        grade: 'K-2',
        description: 'Practice worksheets for basic addition and subtraction, with increasing difficulty levels and word problems.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'sight-words',
        title: 'Sight Words Practice', 
        subject: 'Language Arts', 
        grade: 'K-1',
        description: 'Worksheets focusing on recognizing and writing common sight words, with matching exercises and simple sentences.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'animal-classification',
        title: 'Animal Classification', 
        subject: 'Science', 
        grade: '2-3',
        description: 'Worksheets on classifying animals into mammals, birds, reptiles, amphibians, and fish, with pictures and characteristics.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'map-skills',
        title: 'Map Skills', 
        subject: 'Social Studies', 
        grade: '3-5',
        description: 'Exercises to develop map reading skills, including compass directions, map keys, scale, and geographic features.',
        downloadUrl: '#',
        previewAvailable: true
      }
    ]
  },
  'assessments': {
    title: 'Assessments & Rubrics',
    description: 'Tools to evaluate student understanding and progress.',
    icon: '📊',
    color: 'bg-red-100',
    resources: [
      { 
        id: 'math-skills',
        title: 'Math Skills Assessment', 
        subject: 'Math', 
        grade: '3-5',
        description: 'Comprehensive assessment of grade-level math skills, with scoring guide and analysis tools.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'reading-comprehension',
        title: 'Reading Comprehension Test', 
        subject: 'Language Arts', 
        grade: '4-6',
        description: 'Assessment to evaluate reading comprehension, including passages, multiple-choice questions, and short answer sections.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'science-project-rubric',
        title: 'Science Project Rubric', 
        subject: 'Science', 
        grade: 'All',
        description: 'Detailed rubric for evaluating science projects, with criteria for hypothesis, methodology, results analysis, and presentation.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'history-essay-rubric',
        title: 'History Essay Rubric', 
        subject: 'Social Studies', 
        grade: '6-8',
        description: 'Evaluation tool for history essays, assessing historical accuracy, argument quality, evidence use, and writing mechanics.',
        downloadUrl: '#',
        previewAvailable: true
      }
    ]
  },
  'videos': {
    title: 'Educational Videos',
    description: 'Visual learning resources for classroom or remote instruction.',
    icon: '🎬',
    color: 'bg-purple-100',
    resources: [
      { 
        id: 'fractions-intro',
        title: 'Introduction to Fractions', 
        subject: 'Math', 
        grade: '3-5',
        description: 'Animated video explaining the concept of fractions, equivalent fractions, and basic operations with fractions.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'grammar-basics',
        title: 'Grammar Basics', 
        subject: 'Language Arts', 
        grade: '4-6',
        description: 'Video series covering nouns, verbs, adjectives, adverbs, and basic sentence structure.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'solar-system',
        title: 'The Solar System', 
        subject: 'Science', 
        grade: 'All',
        description: 'Comprehensive tour of our solar system, with stunning visuals and age-appropriate scientific explanations.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'ancient-civilizations',
        title: 'Ancient Civilizations', 
        subject: 'Social Studies', 
        grade: '6-8',
        description: 'Documentary-style videos exploring ancient Egypt, Greece, Rome, China, and Mesopotamia.',
        downloadUrl: '#',
        previewAvailable: false
      }
    ]
  },
  'interactive': {
    title: 'Interactive Tools',
    description: 'Digital tools and interactives for engaged learning.',
    icon: '💻',
    color: 'bg-indigo-100',
    resources: [
      { 
        id: 'fraction-calculator',
        title: 'Fraction Calculator', 
        subject: 'Math', 
        grade: '3-8',
        description: 'Interactive tool for adding, subtracting, multiplying, and dividing fractions, with step-by-step explanations.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'sentence-diagramming',
        title: 'Sentence Diagramming Tool', 
        subject: 'Language Arts', 
        grade: '4-8',
        description: 'Digital tool to practice diagramming sentences, with tutorials and progressive difficulty levels.',
        downloadUrl: '#',
        previewAvailable: false
      },
      { 
        id: 'virtual-lab',
        title: 'Virtual Lab Simulations', 
        subject: 'Science', 
        grade: '5-8',
        description: 'Collection of virtual science experiments covering chemistry, physics, and biology topics.',
        downloadUrl: '#',
        previewAvailable: true
      },
      { 
        id: 'timeline-creator',
        title: 'Interactive Timeline Creator', 
        subject: 'Social Studies', 
        grade: 'All',
        description: 'Tool for students to create digital, interactive timelines with images, videos, and descriptions.',
        downloadUrl: '#',
        previewAvailable: true
      }
    ]
  }
};

export default function ResourceCategoryPage({ params }: { params: { category: string } }) {
  const categoryId = params.category;
  const categoryInfo = resourceData[categoryId as keyof typeof resourceData];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  
  if (!categoryInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Resource Category Not Found</h1>
        <p className="mb-8">The resource category you're looking for doesn't exist.</p>
        <Link 
          href="/resources"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Resources
        </Link>
      </div>
    );
  }
  
  // Filter resources based on search and filters
  const filteredResources = categoryInfo.resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'All' || resource.grade === selectedGrade || resource.grade === 'All';
    
    return matchesSearch && matchesSubject && matchesGrade;
  });
  
  // Get unique subjects from the current category
  const categorySubjects = ['All', ...Array.from(new Set(categoryInfo.resources.map(r => r.subject)))];
  
  // Get unique grade levels from the current category
  const categoryGrades = ['All', ...Array.from(new Set(categoryInfo.resources.map(r => r.grade)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${categoryInfo.color} p-8 rounded-lg shadow-md mb-8`}>
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{categoryInfo.icon}</span>
          <h1 className="text-3xl font-bold">{categoryInfo.title}</h1>
        </div>
        <p className="text-lg mb-6">{categoryInfo.description}</p>
        
        <div>
          <Link 
            href="/resources"
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mr-3"
          >
            ← Back to Resources
          </Link>
          
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Home
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium">Search</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {categorySubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {categoryGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Available Resources ({filteredResources.length})</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-xl font-medium">{resource.title}</h3>
                    
                    <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {resource.subject}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Grade: {resource.grade}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="mb-4 text-gray-700">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={resource.downloadUrl} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Download
                    </a>
                    
                    {resource.previewAvailable && (
                      <Link 
                        href={`/resources/${categoryId}/${resource.id}`}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Preview
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 