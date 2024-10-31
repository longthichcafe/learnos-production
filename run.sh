#!/bin/bash

# Exit the script if any command fails
set -e

echo "Running backend"
cd ./backend # Move to the backend directory (where the backend's package.json is located)
npm start &

echo "Running frontend"

cd ../frontend/learnos # Move to the frontend directory (where the frontend's package.json is located)
npm run dev

echo "All server are running."
