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
    fi
    rm .server.pid
fi

echo "Starting Flask server..."
python3 app.py > flask_server.log 2>&1 &
PID=$!
echo $PID > .server.pid
echo "Server started with PID: $PID"
echo "Log file: $(pwd)/flask_server.log" 