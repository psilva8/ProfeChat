// API Interceptor to redirect API calls to mock endpoints in development
// This helps avoid authentication errors by using local test data

// Store the original fetch function
const originalFetch = window.fetch;

// Override the fetch function to intercept API calls
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  let url = input instanceof Request ? input.url : input.toString();
  const originalUrl = url;
  
  console.log(`[API Interceptor] Original request to: ${url}`);
  
  // Force all API requests to return mock data with 200 status
  if (url.includes('/api/')) {
    // Get the endpoint name (last part of the path)
    const endpoint = url.split('/').pop();
    
    // If the URL is already pointing to a mock endpoint, just pass it through
    if (url.includes('/api/health') || 
        url.includes('/api/direct-test') || 
        url.includes('/api/connect-test')) {
      console.log(`[API Interceptor] Using existing mock endpoint: ${url}`);
    }
    // Redirect proxy endpoints
    else if (url.includes('/api/proxy/')) {
      const mockEndpoint = url.replace('/api/proxy/', '/api/');
      console.log(`[API Interceptor] Redirecting proxy ${url} to mock ${mockEndpoint}`);
      url = mockEndpoint;
    }
    // For activities endpoint
    else if (url.endsWith('/api/activities')) {
      console.log(`[API Interceptor] Using activities mock endpoint`);
      // We'll just pass through to our mock endpoint
    }
    // For rubrics endpoint
    else if (url.endsWith('/api/rubrics')) {
      console.log(`[API Interceptor] Using rubrics mock endpoint`);
      // We'll just pass through to our mock endpoint
    }
    // Generate activities endpoint
    else if (url.includes('/api/generate-activities')) {
      console.log(`[API Interceptor] Using generate-activities mock endpoint`);
      // We'll just pass through to our mock endpoint
    }
  }
  
  // If URL was changed, create a new request
  if (url !== originalUrl) {
    if (input instanceof Request) {
      const newRequest = new Request(url, input);
      console.log(`[API Interceptor] Redirected to: ${url}`);
      return originalFetch(newRequest, init);
    } else {
      console.log(`[API Interceptor] Redirected to: ${url}`);
      return originalFetch(url, init);
    }
  }
  
  // Pass through to the original fetch if no redirection
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