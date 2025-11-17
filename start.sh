#!/bin/bash

echo "Starting OpenAQ Global Air Dashboard..."
echo ""

check_port() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

if check_port 8000; then
    echo "Warning: Port 8000 is already in use. Backend may already be running."
else
    echo "Starting FastAPI Backend on http://localhost:8000..."
    cd backend && python3 main.py &
    BACKEND_PID=$!
    cd ..
fi

sleep 2

echo ""
echo "=========================================="
echo "OpenAQ Global Air Dashboard is ready!"
echo "=========================================="
echo ""
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Now run 'npm run dev' to start the frontend"
echo ""
echo "Press Ctrl+C to stop the backend"
echo ""

wait
