'use client';

import { useEffect, useState } from 'react';

export function ApiProvider() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // We need to import the API interceptor only on the client side
    const loadInterceptor = async () => {
      try {
        // Dynamically import the interceptor
        await import('@/utils/apiInterceptor');
        console.log('API interceptor loaded successfully');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load API interceptor:', error);
      }
    };

    loadInterceptor();

    // Clean up function is not needed since we want the interceptor to stay active
    // until the page is reloaded
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default ApiProvider; 