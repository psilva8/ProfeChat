'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close dropdowns when mobile menu is toggled
    setResourcesDropdownOpen(false);
    setToolsDropdownOpen(false);
  };

  const toggleResourcesDropdown = () => {
    setResourcesDropdownOpen(!resourcesDropdownOpen);
    setToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setToolsDropdownOpen(!toolsDropdownOpen);
    setResourcesDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-3">
              P
            </div>
            <span className="font-bold text-xl text-gray-900">ProfeChat</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/dashboard')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          
          {/* Resources Dropdown */}
          <div className="relative inline-block text-left">
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive('/curriculum')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleResourcesDropdown}
            >
              Recursos
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            {resourcesDropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1" role="none">
                  <Link
                    href="/curriculum"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setResourcesDropdownOpen(false)}
                  >
                    Currículo Nacional
                  </Link>
                  <Link
                    href="/rubrics"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setResourcesDropdownOpen(false)}
                  >
                    Rúbricas de Evaluación
                  </Link>
                  <Link
                    href="/standards"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setResourcesDropdownOpen(false)}
                  >
                    Estándares Educativos
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Tools Dropdown */}
          <div className="relative inline-block text-left">
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive('/lesson-plans') || isActive('/activities')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleToolsDropdown}
            >
              Herramientas
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            {toolsDropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1" role="none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-500">PLANIFICACIÓN</span>
                  </div>
                  <Link
                    href="/lesson-plans/new"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Generar Plan de Lección
                  </Link>
                  <Link
                    href="/activities/new"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Crear Actividades
                  </Link>
                  
                  <div className="px-4 py-2 border-b border-t border-gray-100 mt-1">
                    <span className="text-xs font-semibold text-gray-500">DIAGNÓSTICO</span>
                  </div>
                  <Link
                    href="/test/diagnostics"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sistema Diagnóstico
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link
            href="/community"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/community')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Comunidad
          </Link>
          
          <Link
            href="/help"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/help')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ayuda
          </Link>
        </div>
        
        {/* Profile and settings */}
        <div className="hidden md:flex items-center">
          <button 
            className="ml-4 flex items-center text-gray-700 hover:text-gray-900"
          >
            <span className="sr-only">Notificaciones</span>
            <div className="relative">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </div>
          </button>
          
          <button className="ml-6 bg-gray-200 flex text-sm rounded-full focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              P
            </div>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 border-t border-gray-200 pt-4 pb-2">
          <div className="px-2 space-y-1">
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <button
              className={`w-full text-left flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive('/curriculum')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleResourcesDropdown}
            >
              <span>Recursos</span>
              <svg
                className={`h-5 w-5 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            {resourcesDropdownOpen && (
              <div className="pl-4">
                <Link
                  href="/curriculum"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Currículo Nacional
                </Link>
                <Link
                  href="/rubrics"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rúbricas de Evaluación
                </Link>
                <Link
                  href="/standards"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Estándares Educativos
                </Link>
              </div>
            )}
            
            <button
              className={`w-full text-left flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive('/lesson-plans') || isActive('/activities')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleToolsDropdown}
            >
              <span>Herramientas</span>
              <svg
                className={`h-5 w-5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            {toolsDropdownOpen && (
              <div className="pl-4">
                <div className="py-1 border-b border-gray-100">
                  <span className="block px-3 py-1 text-xs font-semibold text-gray-500">PLANIFICACIÓN</span>
                </div>
                <Link
                  href="/lesson-plans/new"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Generar Plan de Lección
                </Link>
                <Link
                  href="/activities/new"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Crear Actividades
                </Link>
                <div className="py-1 border-t border-b border-gray-100">
                  <span className="block px-3 py-1 text-xs font-semibold text-gray-500">DIAGNÓSTICO</span>
                </div>
                <Link
                  href="/test/diagnostics"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sistema Diagnóstico
                </Link>
              </div>
            )}
            
            <Link
              href="/community"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/community')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Comunidad
            </Link>
            
            <Link
              href="/help"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/help')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Ayuda
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  P
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  Profesor
                </div>
                <div className="text-sm font-medium text-gray-500">
                  profesor@ejemplo.com
                </div>
              </div>
            </div>
            
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configuración
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 