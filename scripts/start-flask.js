#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to store the detected Flask port
const portFilePath = path.join(__dirname, '..', '.flask-port');

// Try to kill any existing Flask processes
function killExistingFlaskProcesses() {
  try {
    console.log('Attempting to kill any existing Flask processes...');
    execSync('pkill -f "python.*app\\.py"', { stdio: 'ignore' });
    console.log('Successfully killed existing Flask processes');
  } catch (error) {
    // It's okay if no processes were killed
    console.log('No existing Flask processes found to kill');
  }
}

// Generate a random port in the range 5340-5399
function getRandomPort() {
  return Math.floor(Math.random() * 60) + 5340;
}

console.log('Installing Flask dependencies...');

// Kill any existing Flask processes to avoid port conflicts
killExistingFlaskProcesses();

// Install Flask dependencies first
const installDeps = spawn('python3', ['-m', 'pip', 'install', '-r', 'api/python/requirements.txt'], {
  stdio: 'inherit'
});

installDeps.on('close', (code) => {
  if (code !== 0) {
    console.error(`Failed to install dependencies. Exit code: ${code}`);
    process.exit(code);
  }
  
  console.log('Starting Flask server...');
  
  // Generate a random port to avoid conflicts
  const randomPort = getRandomPort();
  
  // Set environment variable for Flask server
  const env = { ...process.env, FLASK_SERVER_PORT: randomPort.toString() };
  
  // Start the Flask process with the custom port
  const flaskProcess = spawn('python3', ['api/python/app.py'], {
    stdio: ['inherit', 'pipe', 'inherit'], // Only pipe stdout
    env: env
  });
  
  // Variable to track if we've found and saved the port
  let portFound = false;
  
  // Listen for Flask server output
  flaskProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Flask: ${output.trim()}`);
    
    // Look for the port number in the output
    const portMatch = output.match(/FLASK_SERVER_PORT=(\d+)/);
    if (portMatch && portMatch[1]) {
      const port = portMatch[1];
      console.log(`Detected Flask server running on port: ${port}`);
      
      try {
        // Save port to a file for other processes to read
        fs.writeFileSync(portFilePath, port, 'utf8');
        console.log(`Successfully wrote port ${port} to ${portFilePath}`);
        
        // Set an environment variable in case child processes need it
        process.env.FLASK_SERVER_PORT = port;
        portFound = true;
      } catch (err) {
        console.error(`Error writing port to file: ${err.message}`);
      }
    }
    
    // Check for the success message indicating Flask is running
    if (output.includes('Running on http://127.0.0.1:')) {
      console.log('Flask server is running successfully');
    }
    
    // Check for error messages
    if (output.includes('Address already in use')) {
      console.error('Flask port conflict detected. Restarting with a different port...');
      flaskProcess.kill();
      
      // Try again with a different random port
      setTimeout(() => {
        restartFlaskWithRandomPort();
      }, 1000);
    }
  });
  
  flaskProcess.on('error', (err) => {
    console.error(`Failed to start Flask process: ${err.message}`);
  });
  
  flaskProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Flask process exited with code ${code}`);
      
      // If it wasn't a port conflict (which we handle specially above),
      // try once more with a different port
      if (!portFound) {
        console.log('Attempting to restart Flask with a different port...');
        setTimeout(() => {
          restartFlaskWithRandomPort();
        }, 1000);
      }
    }
  });
  
  // Function to restart Flask with a new random port
  function restartFlaskWithRandomPort() {
    // Generate a new random port
    const newRandomPort = getRandomPort();
    console.log(`Trying again with port ${newRandomPort}...`);
    
    // Set environment variable for Flask server
    const newEnv = { ...process.env, FLASK_SERVER_PORT: newRandomPort.toString() };
    
    // Start the Flask process with the new port
    const newFlaskProcess = spawn('python3', ['api/python/app.py'], {
      stdio: ['inherit', 'pipe', 'inherit'], // Only pipe stdout
      env: newEnv
    });
    
    // Listen for output from the new process
    newFlaskProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Flask: ${output.trim()}`);
      
      // Look for the port number in the output
      const portMatch = output.match(/FLASK_SERVER_PORT=(\d+)/);
      if (portMatch && portMatch[1]) {
        const port = portMatch[1];
        console.log(`Detected Flask server running on port: ${port}`);
        
        try {
          // Save port to a file for other processes to read
          fs.writeFileSync(portFilePath, port, 'utf8');
          console.log(`Successfully wrote port ${port} to ${portFilePath}`);
          
          // Set an environment variable in case child processes need it
          process.env.FLASK_SERVER_PORT = port;
        } catch (err) {
          console.error(`Error writing port to file: ${err.message}`);
        }
      }
    });
  }
  
  // Set a timeout to exit if port isn't detected
  const timeoutId = setTimeout(() => {
    if (!portFound) {
      console.error('Timed out waiting for Flask server to start and report its port');
      
      // Try to detect Flask port by checking common ports
      tryDetectFlaskPort().then(port => {
        if (port) {
          console.log(`Detected Flask server running on port ${port} using fallback method`);
          fs.writeFileSync(portFilePath, String(port), 'utf8');
          console.log(`Wrote port ${port} to ${portFilePath}`);
        } else {
          console.error('Could not detect Flask server port using fallback method');
        }
      });
    }
  }, 10000);
  
  // Clean up on process exit
  process.on('exit', () => {
    clearTimeout(timeoutId);
    
    // Try to remove the port file
    try {
      if (fs.existsSync(portFilePath)) {
        fs.unlinkSync(portFilePath);
      }
    } catch (err) {
      // Ignore errors on cleanup
    }
  });
  
  // Handle signals
  process.on('SIGINT', () => {
    console.log('Stopping Flask server...');
    flaskProcess.kill('SIGINT');
    process.exit(0);
  });
});

// Function to try to detect Flask port by checking common ports
async function tryDetectFlaskPort() {
  const commonPorts = [5000, 5336, 5337, 5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350];
  
  for (const port of commonPorts) {
    try {
      console.log(`Checking if Flask is running on port ${port}...`);
      const response = await fetch(`http://localhost:${port}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(500) // Timeout after 500ms
      });
      
      if (response.ok) {
        console.log(`Status check successful on port ${port}`);
        return port;
      }
    } catch (error) {
      // Ignore errors, just try next port
      console.log(`Port ${port} check failed: ${error.message}`);
    }
  }
  
  return null;
} 