#!/bin/bash

# Copy production env file for testing
cp .env.production .env.production.local

# Run the build with production settings
NODE_ENV=production npm run build

# Check the exit code
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully! Your fixes resolved the issues."
else
  echo "❌ Build failed. Please check the errors above."
fi

# Clean up
rm .env.production.local 