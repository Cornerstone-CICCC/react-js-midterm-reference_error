#!/bin/sh
echo "Starting Next.js frontend..."
npm run dev &
PID=$!
sleep 5
echo "✅ Frontend is now running at http://localhost:3000"
wait $PID
