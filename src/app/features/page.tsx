import React from 'react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Características
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Descubre todas las herramientas que tenemos para mejorar tu experiencia docente
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Lesson Plans */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Planes de Lección</h3>
            <p className="mt-2 text-gray-500">
              Genera planes de lección detallados y personalizados en minutos
            </p>
          </div>

          {/* Rubrics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Rúbricas</h3>
            <p className="mt-2 text-gray-500">
              Crea rúbricas de evaluación alineadas con los estándares educativos
            </p>
          </div>

          {/* Unit Plans */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Planes de Unidad</h3>
            <p className="mt-2 text-gray-500">
              Diseña unidades didácticas completas con objetivos y actividades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 