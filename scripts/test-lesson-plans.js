const http = require('http');
const https = require('https');
const { checkFlaskHealth } = require('./check-flask');

/**
 * Simple function to make HTTP requests
 */
async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = responseData ? JSON.parse(responseData) : {};
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            data: response 
          });
        } catch (e) {
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            data: responseData 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test the Flask API directly
 */
async function testFlaskAPI() {
  console.log('\n--- Testing Flask API directly ---');
  
  try {
    // First check if Flask is healthy
    const port = await checkFlaskHealth();
    if (!port) {
      console.error('Flask API is not healthy, cannot continue');
      return false;
    }
    
    // Test the generate-lesson endpoint
    const testData = {
      subject: 'Mathematics',
      grade: '5',
      topic: 'Fractions',
      objectives: 'Understanding fractions as parts of a whole',
      duration: 45
    };
    
    console.log(`Sending test data to Flask API on port ${port}:`, testData);
    
    const response = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/generate-lesson',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testData);
    
    console.log(`Flask API response status: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Flask API test successful');
      console.log(`Lesson plan content (first 100 chars): ${response.data.lesson_plan.substring(0, 100)}...`);
      return true;
    } else {
      console.error('❌ Flask API test failed:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Flask API:', error.message);
    return false;
  }
}

/**
 * Test the Next.js API route
 * Note: This will return 401 Unauthorized unless you have a valid session
 */
async function testNextJsAPI() {
  console.log('\n--- Testing Next.js API route ---');
  
  try {
    const testData = {
      subject: 'Mathematics',
      grade: '5',
      topic: 'Fractions',
      objectives: 'Understanding fractions as parts of a whole',
      duration: 45
    };
    
    console.log('Sending test data to Next.js API:', testData);
    
    const nextJsPort = 3003; // Update this if your Next.js app is running on a different port
    
    const response = await makeRequest({
      hostname: 'localhost',
      port: nextJsPort,
      path: '/api/lesson-plans/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testData);
    
    console.log(`Next.js API response status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('✅ Next.js API test successful');
      console.log('Response:', response.data);
      return true;
    } else {
      console.log('❌ Next.js API test returned non-200 status (may be expected if not authenticated)');
      console.log('Response:', response.data);
      
      if (response.statusCode === 401) {
        console.log('This is expected if you are not authenticated. To test with authentication:');
        console.log('1. Login through the web interface');
        console.log('2. Copy the session cookie');
        console.log('3. Update this script to include the cookie in the request');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Next.js API:', error.message);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('Starting lesson plan API tests...');
  
  // Test Flask API
  const flaskResult = await testFlaskAPI();
  
  // Test Next.js API route
  const nextJsResult = await testNextJsAPI();
  
  console.log('\n--- Test Results ---');
  console.log(`Flask API: ${flaskResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Next.js API: ${nextJsResult ? '✅ PASS' : '⚠️ AUTH REQUIRED'}`);
  
  if (flaskResult && !nextJsResult) {
    console.log('\nDiagnosis: The Flask API is working correctly, but the Next.js API integration requires authentication.');
    console.log('Possible issues:');
    console.log('1. You need to be authenticated to use the API (expected behavior)');
    console.log('2. The Next.js API is not correctly connecting to the Flask API');
    console.log('3. There might be an issue with how the response from Flask is being processed');
  }
}

// Run the tests
runTests(); 