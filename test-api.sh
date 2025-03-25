#!/bin/bash

# Step 1: Login to get a session cookie
echo "Logging in..."
RESPONSE=$(curl -i -s -X POST "http://localhost:3008/api/auth/[...nextauth]/callback/credentials" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","redirect":false}')

# Extract the set-cookie header
COOKIE=$(echo "$RESPONSE" | grep -i "set-cookie" | grep "next-auth.session-token" | cut -d' ' -f2 | tr -d '\r')

if [ -z "$COOKIE" ]; then
    echo "Failed to get authentication cookie!"
    exit 1
fi

echo "Got authentication cookie."

# Step 2: Use the cookie to request the lesson plans
echo "Fetching lesson plans..."
curl -v "http://localhost:3008/api/lesson-plans" \
  -H "Cookie: $COOKIE" | jq .

