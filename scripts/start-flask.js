#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to store the detected Flask port
const portFilePath = path.join(__dirname, '..', '.flask-port');

console.log('Installing Flask dependencies...');

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
  
  // Start the Flask process
  const flaskProcess = spawn('python3', ['api/python/app.py'], {
    stdio: ['ignore', 'pipe', process.stderr],
    detached: true
  });
  
  let portFound = false;
  
  // Listen for data from stdout
  flaskProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Flask output: ${output}`);
    
    // Look for the port number in the output
    const portMatch = output.match(/FLASK_SERVER_PORT=(\d+)/);
    if (portMatch && portMatch[1]) {
      const port = portMatch[1];
      console.log(`Flask server running on port: ${port}`);
      
      // Save the port to a file for Next.js to read
      fs.writeFileSync(portFilePath, port, 'utf8');
      portFound = true;
      
      // Set environment variable for child processes
      process.env.FLASK_SERVER_PORT = port;
    }
  });
  
  // Keep the process reference to prevent it from being terminated
  flaskProcess.unref();
  
  // Set a timeout to check if we found the port
  setTimeout(() => {
    if (!portFound) {
      console.error('Could not detect Flask server port in the given time');
      process.exit(1);
    }
    
    console.log('Flask server started successfully');
    
    // Optional: cleanup on process exit
    process.on('exit', () => {
      try {
        if (fs.existsSync(portFilePath)) {
          fs.unlinkSync(portFilePath);
        }
      } catch (err) {
        console.error('Error cleaning up port file:', err);
      }
    });
    
    process.exit(0);
  }, 10000); // Wait for 10 seconds to find the port 
}); 