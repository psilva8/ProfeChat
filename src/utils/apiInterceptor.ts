// API Interceptor to redirect API calls to mock endpoints in development
// This helps avoid authentication errors by using local test data

// Map of API endpoints to their mock equivalents
const API_REDIRECTS = {
  '/api/proxy/generate-activities': '/api/generate-activities',
  '/api/proxy/activities': '/api/activities',
  '/api/proxy/lesson-plans': '/api/lesson-plans',
  '/api/proxy/rubrics': '/api/rubrics',
  '/api/proxy/generate-lesson': '/api/generate-lesson',
  '/api/proxy/health': '/api/health',
  '/api/proxy/check-db': '/api/direct-test',
  '/api/proxy/test-openai-key': '/api/health',
  '/api/activities': '/api/activities',
  '/api/generate-activities': '/api/generate-activities'
};

// Store the original fetch function
const originalFetch = window.fetch;

// Override the fetch function to intercept API calls
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  let url = input instanceof Request ? input.url : input.toString();
  
  // Check if this URL should be redirected
  for (const [pattern, replacement] of Object.entries(API_REDIRECTS)) {
    if (url.includes(pattern)) {
      const newUrl = url.replace(pattern, replacement);
      console.log(`[API Interceptor] Redirecting ${url} to ${newUrl}`);
      
      // If it's a Request object, create a new one with the updated URL
      if (input instanceof Request) {
        const newRequest = new Request(newUrl, input);
        return originalFetch(newRequest, init);
      }
      
      // Otherwise just update the URL string
      url = newUrl;
      input = newUrl;
      break;
    }
  }
  
  // Call the original fetch with possibly modified parameters
  return originalFetch(input, init);
};

// Export a function to disable the interceptor if needed
export function disableApiInterceptor() {
  if (window.fetch !== originalFetch) {
    console.log('[API Interceptor] Restoring original fetch function');
    window.fetch = originalFetch;
  }
}

// By default, this module just needs to be imported once to start intercepting
export default {}; 