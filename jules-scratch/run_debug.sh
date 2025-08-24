#!/bin/bash

cd /app

echo "Attempting to stop any running servers..."
pkill -f "npm start"
pkill -f "http.server 8000"
sleep 2

echo "Starting servers..."

# Start backend server and log output
(cd backend && npm start > ../backend.log 2>&1 &)
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID"

# Start frontend server and log output
(cd frontend && python3 -m http.server 8000 > ../frontend.log 2>&1 &)
FRONTEND_PID=$!
echo "Frontend server started with PID $FRONTEND_PID"

echo "Servers are running. Please test the application now."
echo "I will wait for 60 seconds before shutting them down."

sleep 60

echo "Shutting down servers..."
kill $BACKEND_PID
kill $FRONTEND_PID

echo "Done."
