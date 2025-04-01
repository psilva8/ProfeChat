#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 could not be found"
    exit 1
fi

# Check if the virtual environment exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Check if required packages are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "Installing required packages..."
    python3 -m pip install -r requirements.txt
fi

# Kill any existing server process
if [ -f ".server.pid" ]; then
    OLD_PID=$(cat .server.pid)
    if ps -p $OLD_PID > /dev/null; then
        echo "Stopping existing server (PID: $OLD_PID)..."
        kill $OLD_PID
        sleep 2
    fi
    rm .server.pid
fi

# Try to clear any processes using the default port
DEFAULT_PORT=5338
for PORT in 5338 5339 5340 5341 5342; do
    # Check if port is in use
    if lsof -i :$PORT > /dev/null; then
        echo "Port $PORT is in use, attempting to kill the process..."
        lsof -i :$PORT | awk 'NR>1 {print $2}' | xargs kill -9 2>/dev/null
        sleep 1
    fi
    
    # Verify the port is free
    if ! lsof -i :$PORT > /dev/null; then
        echo "Port $PORT is available"
        DEFAULT_PORT=$PORT
        break
    fi
done

# Update the .flask-port file with the selected port
echo $DEFAULT_PORT > ../.flask-port
echo "Using port $DEFAULT_PORT for Flask server"

echo "Starting Flask server on port $DEFAULT_PORT..."
FLASK_SERVER_PORT=$DEFAULT_PORT python3 app.py > flask_server.log 2>&1 &
PID=$!
echo $PID > .server.pid
echo "Server started with PID: $PID"
echo "Log file: $(pwd)/flask_server.log"

# Wait a moment to check if server started properly
sleep 2
if ! ps -p $PID > /dev/null; then
    echo "Server failed to start. Check flask_server.log for details."
    cat flask_server.log
    exit 1
fi

echo "Testing server health..."
curl -s http://localhost:$DEFAULT_PORT/api/health
echo "" 