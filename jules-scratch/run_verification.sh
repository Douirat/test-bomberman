#!/bin/bash

cd /app

# Kill any process on port 8000
fuser -k 8000/tcp

# Start backend server
(cd backend && npm start &)
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID"

# Start frontend server
(cd frontend && python -m http.server 8000 &)
FRONTEND_PID=$!
echo "Frontend server started with PID $FRONTEND_PID"

# Wait for servers to be ready
sleep 5

# Run verification script
python /app/jules-scratch/verification/verify_dot_grid.py

# Kill servers
kill $BACKEND_PID
kill $FRONTEND_PID
