import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the given path is a test route that should bypass authentication
 */
export function isTestRoute(path: string): boolean {
  // Test routes that should bypass authentication
  const testPaths = [
    '/test',
    '/api/test-',
    '/api/proxy/test-',
    '/api/direct-test',
    '/api/config-check',
    '/api/generate-lesson'
  ];
  
  // Check if the path starts with any of the test paths
  return testPaths.some(testPath => path.startsWith(testPath));
} 