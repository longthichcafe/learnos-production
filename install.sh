#!/bin/bash

# Exit the script if any command fails
set -e

echo "Installing backend dependencies..."
cd ./backend # Move to the backend directory (where the backend's package.json is located)
npm install

echo "Backend dependencies installed."

echo "Installing frontend dependencies..."

cd ../frontend/learnos # Move to the frontend directory (where the frontend's package.json is located)
npm install

echo "Frontend dependencies installed."

echo "All dependencies are successfully installed."
