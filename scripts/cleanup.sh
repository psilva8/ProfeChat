#!/bin/bash

# Stop all running processes
echo "Stopping all running processes..."
killall -9 node || true
killall -9 npm || true
killall -9 python3 || true

# Clean up any port files
echo "Cleaning up port files..."
rm -f .flask-port
rm -f api/python/.server.pid

# Remove temporary files
echo "Cleaning up temporary files..."
rm -rf .next
rm -rf node_modules/.cache

# Restart the application
echo "Restarting the application..."
echo "You can now run 'npm run dev' to start the application clean" 