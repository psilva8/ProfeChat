const http = require('http');

/**
 * Check Flask server health across multiple potential ports
 */
async function checkFlaskHealth() {
  const basePort = parseInt(process.env.FLASK_PORT || '5336');
  const maxAttempts = 5;
  
  console.log('Checking Flask server health...');
  
  for (let i = 0; i < maxAttempts; i++) {
    const port = basePort + i;
    try {
      const healthy = await checkPort(port);
      if (healthy) {
        console.log(`✅ Flask server is healthy on port ${port}`);
        return port;
      }
    } catch (error) {
      console.log(`❌ Flask server not responding on port ${port}: ${error.message}`);
    }
  }
  
  console.error('❌ Flask server is not available on any port');
  return null;
}

/**
 * Check if a specific port is responding with a healthy status
 */
function checkPort(port) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path: '/api/health',
        method: 'GET',
        timeout: 3000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status === 'healthy') {
              resolve(true);
            } else {
              reject(new Error('Unhealthy response'));
            }
          } catch (e) {
            reject(new Error('Invalid response format'));
          }
        });
      }
    );
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    req.end();
  });
}

// Run if directly executed
if (require.main === module) {
  checkFlaskHealth().then(port => {
    if (port) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { checkFlaskHealth }; 