#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Check if PID file exists
if [ -f ".server.pid" ]; then
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null; then
        echo "Stopping Flask server (PID: $PID)..."
        kill $PID
        echo "Server stopped."
    else
        echo "No running server found with PID: $PID"
    fi
    rm .server.pid
else
    echo "No server PID file found."
fi 