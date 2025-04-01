#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const FLASK_DIR = path.join(__dirname, '..', 'api', 'python');
const VENV_DIR = path.join(FLASK_DIR, 'venv');
const FLASK_PORT_FILE = path.join(__dirname, '..', '.flask-port');

// Kill any existing Flask processes
const killExistingProcesses = () => {
  console.log('Attempting to kill any existing Flask processes...');

  return new Promise((resolve) => {
    // Find and kill processes on commonly used ports
    const ports = [5336, 5338, 5390, 5391, 5392, 5393];
    const killCmd = process.platform === 'win32' 
      ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr ${ports.join(' ')}') do taskkill /F /PID %a`
      : `lsof -ti:${ports.join(',')} | xargs kill -9 || true`;
    
    exec(killCmd, (error) => {
      if (error) {
        console.warn('No existing Flask processes found or unable to kill them');
      } else {
        console.log('Successfully killed existing Flask processes');
      }
      resolve();
    });
  });
};

// Install Flask dependencies
const installDependencies = () => {
  console.log('Installing Flask dependencies...');
  
  return new Promise((resolve, reject) => {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const pip = spawn(pythonCmd, ['-m', 'pip', 'install', '-r', path.join(FLASK_DIR, 'requirements.txt')]);
    
    pip.stdout.on('data', (data) => {
      console.log(`Flask: ${data.toString().trim()}`);
    });
    
    pip.stderr.on('data', (data) => {
      console.error(`Flask: ${data.toString().trim()}`);
    });
    
    pip.on('close', (code) => {
      if (code !== 0) {
        console.warn(`Flask dependencies installation exited with code ${code}`);
      }
      resolve();
    });
  });
};

// Start Flask server and capture its port
const startFlaskServer = () => {
  console.log('Starting Flask server...');
  
  return new Promise((resolve, reject) => {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const flask = spawn(pythonCmd, [path.join(FLASK_DIR, 'app.py')], {
      env: {
        ...process.env,
        // Set a random port between 5400-5499 to avoid conflicts
        FLASK_SERVER_PORT: process.env.FLASK_SERVER_PORT || (5400 + Math.floor(Math.random() * 100))
      }
    });
    
    // Create readline interface to read Flask output line by line
    const rl = readline.createInterface({
      input: flask.stdout,
      crlfDelay: Infinity
    });
    
    let flaskPort = null;
    let serverRunning = false;
    
    // Listen for the Flask port in the output
    rl.on('line', (line) => {
      console.log(`Flask: ${line}`);
      
      // Try to extract the Flask port
      const portMatch = line.match(/FLASK_SERVER_PORT=(\d+)/);
      if (portMatch && portMatch[1]) {
        flaskPort = portMatch[1];
        console.log(`Detected Flask server running on port: ${flaskPort}`);
        
        // Save port to file for other processes to use
        fs.writeFileSync(FLASK_PORT_FILE, flaskPort);
        console.log(`Successfully wrote port ${flaskPort} to ${FLASK_PORT_FILE}`);
      }
      
      // Check if the server is running
      if (line.includes('Running on http://127.0.0.1:') || line.includes('Debugger PIN:')) {
        serverRunning = true;
      }
      
      // Resolve when we've detected both the port and the server running
      if (flaskPort && serverRunning && !resolved) {
        console.log('Flask server is running successfully');
        resolved = true;
        resolve(flaskPort);
      }
    });
    
    // Handle errors
    flask.stderr.on('data', (data) => {
      const errorText = data.toString().trim();
      console.error(`Flask: ${errorText}`);
      
      // Check for port already in use error
      if (errorText.includes('Address already in use') && !resolved) {
        console.error(`Port in use error detected. Killing process and trying again...`);
        resolved = true;
        
        // Kill flask process
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', flask.pid, '/f', '/t']);
        } else {
          process.kill(flask.pid);
        }
        
        // Try again with a different port
        setTimeout(() => {
          process.env.FLASK_SERVER_PORT = 5400 + Math.floor(Math.random() * 100);
          resolve(startFlaskServer());
        }, 1000);
      }
    });
    
    let resolved = false;
    
    // Handle Flask process exit
    flask.on('close', (code) => {
      if (!resolved) {
        if (code !== 0) {
          console.error(`Flask server exited with code ${code}`);
          reject(new Error(`Flask server exited with code ${code}`));
        } else {
          console.log('Flask server exited cleanly');
          resolve(flaskPort);
        }
        resolved = true;
      }
    });
  });
};

// Main function
async function main() {
  try {
    await killExistingProcesses();
    await installDependencies();
    await startFlaskServer();
  } catch (error) {
    console.error('Error starting Flask server:', error);
    process.exit(1);
  }
}

main(); 