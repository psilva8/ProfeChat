#!/usr/bin/env node
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

/**
 * Log a message with a specified color
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Log a section header
 */
function logSection(title) {
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log('='.repeat(50));
}

/**
 * Log a success message
 */
function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

/**
 * Log an error message
 */
function logError(message) {
  log(`❌ ${message}`, colors.red);
}

/**
 * Log a warning message
 */
function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

/**
 * Read the Flask port from various sources
 */
async function getFlaskPort() {
  // Try to read from the .flask-port file
  const portFilePath = path.join(__dirname, '..', '.flask-port');
  if (fs.existsSync(portFilePath)) {
    const port = parseInt(fs.readFileSync(portFilePath, 'utf8').trim(), 10);
    if (!isNaN(port)) {
      log(`Found Flask port ${port} in .flask-port file`, colors.cyan);
      return port;
    }
  }

  // Try common Flask ports
  const commonPorts = [5338, 5336, 5337, 5339, 5340, 5000];
  for (const port of commonPorts) {
    try {
      log(`Checking if Flask server is running on port ${port}...`, colors.cyan);
      const response = await fetch(`http://localhost:${port}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        logSuccess(`Found active Flask server on port ${port}`);
        return port;
      }
    } catch (error) {
      // Ignore, just try next port
    }
  }

  logWarning('No active Flask server found. Starting a new server...');
  
  // Try to start the Flask server
  try {
    const flaskProcess = spawn('python3', [path.join(__dirname, '..', 'api', 'python', 'app.py')], {
      detached: true,
      stdio: 'ignore'
    });
    flaskProcess.unref();
    
    log('Waiting for Flask server to start...', colors.cyan);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if server started successfully
    for (const port of commonPorts) {
      try {
        const response = await fetch(`http://localhost:${port}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          logSuccess(`Started Flask server on port ${port}`);
          return port;
        }
      } catch (error) {
        // Ignore, just try next port
      }
    }
  } catch (error) {
    logError(`Failed to start Flask server: ${error.message}`);
  }
  
  logError('Could not find or start a Flask server');
  return null;
}

/**
 * Test if the Flask server is running and responding to health checks
 */
async function testFlaskHealth(port) {
  logSection('Testing Flask Server Health');
  
  try {
    log(`Making request to http://localhost:${port}/api/health`, colors.cyan);
    const response = await fetch(`http://localhost:${port}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess(`Flask server is healthy: ${JSON.stringify(data)}`);
      return true;
    } else {
      logError(`Flask server returned status ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to reach Flask server: ${error.message}`);
    return false;
  }
}

/**
 * Test generating a lesson plan directly through the Flask API
 */
async function testDirectLessonGeneration(port) {
  logSection('Testing Direct Lesson Generation');
  
  try {
    const testData = {
      subject: 'Math',
      grade: '5',
      topic: 'Fractions',
      duration: 60,
      objectives: 'Learn to add fractions'
    };
    
    log(`Making direct request to http://localhost:${port}/api/generate-lesson`, colors.cyan);
    log(`Request data: ${JSON.stringify(testData)}`, colors.cyan);
    
    const response = await fetch(`http://localhost:${port}/api/generate-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess('Direct lesson generation successful');
      log(`Response snippet: ${JSON.stringify(data).substring(0, 100)}...`, colors.green);
      return true;
    } else {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = response.statusText;
      }
      
      logError(`Flask API returned status ${response.status}: ${errorText}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to generate lesson directly: ${error.message}`);
    return false;
  }
}

/**
 * Test Next.js API proxying to Flask
 */
async function testNextApiProxy() {
  logSection('Testing Next.js API Proxy');
  
  try {
    log('Making request to http://localhost:3000/api/proxy/health', colors.cyan);
    const response = await fetch('http://localhost:3000/api/proxy/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess(`Next.js API proxy is working: ${JSON.stringify(data)}`);
      return true;
    } else {
      logError(`Next.js API proxy returned status ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to reach Next.js API proxy: ${error.message}`);
    logWarning('Make sure your Next.js development server is running on port 3000');
    return false;
  }
}

/**
 * Test generating a lesson plan through the Next.js API
 */
async function testNextLessonGeneration() {
  logSection('Testing Next.js Lesson Generation API');
  
  try {
    const testData = {
      subject: 'Math',
      grade: '5',
      topic: 'Fractions',
      duration: 60,
      objectives: 'Learn to add fractions'
    };
    
    log('Making request to http://localhost:3000/api/generate-lesson', colors.cyan);
    log(`Request data: ${JSON.stringify(testData)}`, colors.cyan);
    
    const response = await fetch('http://localhost:3000/api/generate-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess('Next.js lesson generation successful');
      log(`Response snippet: ${JSON.stringify(data).substring(0, 100)}...`, colors.green);
      return true;
    } else {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = response.statusText;
      }
      
      logError(`Next.js API returned status ${response.status}: ${errorText}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to generate lesson through Next.js: ${error.message}`);
    logWarning('Make sure your Next.js development server is running on port 3000');
    return false;
  }
}

/**
 * Check if the OpenAI API key is valid
 */
async function testOpenAIApiKey(port) {
  logSection('Testing OpenAI API Key');
  
  try {
    log(`Making request to http://localhost:${port}/api/test-openai-key`, colors.cyan);
    const response = await fetch(`http://localhost:${port}/api/test-openai-key`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.valid) {
        logSuccess('OpenAI API key is valid');
      } else {
        logError(`OpenAI API key is invalid: ${data.error}`);
      }
      return data.valid;
    } else {
      logError(`Flask API returned status ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to test OpenAI API key: ${error.message}`);
    return false;
  }
}

/**
 * Main function to run all tests
 */
async function main() {
  log(`${colors.bright}${colors.magenta}API Connection Test Script${colors.reset}`, colors.magenta);
  log('This script will test the connection between Next.js, Flask, and OpenAI', colors.magenta);
  
  const port = await getFlaskPort();
  if (!port) {
    process.exit(1);
  }
  
  const healthOk = await testFlaskHealth(port);
  if (!healthOk) {
    logWarning('Flask server health check failed. Continuing with other tests...');
  }
  
  const directGenerationOk = await testDirectLessonGeneration(port);
  if (!directGenerationOk) {
    logError('Direct lesson generation failed. This indicates an issue with the Flask server.');
    process.exit(1);
  }
  
  const proxyOk = await testNextApiProxy();
  if (!proxyOk) {
    logWarning('Next.js API proxy test failed. Make sure your Next.js server is running.');
  }
  
  const nextGenerationOk = await testNextLessonGeneration();
  if (!nextGenerationOk) {
    logError('Next.js lesson generation failed. This may indicate an issue with the Next.js to Flask connection.');
  }
  
  // Add a route to test OpenAI API key
  // await testOpenAIApiKey(port);
  
  logSection('Test Summary');
  log(`Flask server health: ${healthOk ? '✅' : '❌'}`, healthOk ? colors.green : colors.red);
  log(`Direct lesson generation: ${directGenerationOk ? '✅' : '❌'}`, directGenerationOk ? colors.green : colors.red);
  log(`Next.js API proxy: ${proxyOk ? '✅' : '❌'}`, proxyOk ? colors.green : colors.red);
  log(`Next.js lesson generation: ${nextGenerationOk ? '✅' : '❌'}`, nextGenerationOk ? colors.green : colors.red);
  
  if (healthOk && directGenerationOk && proxyOk && nextGenerationOk) {
    logSuccess('All tests passed! Your API connection is working correctly.');
  } else {
    logWarning('Some tests failed. Review the logs above for details.');
  }
}

// Run the main function
main().catch(error => {
  logError(`Unhandled error: ${error.message}`);
  process.exit(1);
}); 