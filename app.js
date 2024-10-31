/*
The main application
*/
require('dotenv').config();

// Import required modules
const express = require('express');  // the Express web framework
// const session = require('express-session');
// const sessionConfig = require('./src/configs/session');
const routes = require('./src/routes/index'); 

// Create an Express application
const app = express();

// Set up session 
console.log("Setting up session");
// app.use(session(sessionConfig));

// Middleware to parse JSON
app.use(express.json());  

// Set up mongodb connection
// const mongoose = require('mongoose');
// const uri = process.env.MONGO_URI;

// Connect to MongoDB
// mongoose.connect(uri, {})
//   .then(() => {
//     console.log('Successfully connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

// Routes
// Mount the routes at the '/' path
// This means all routes in 'routes' will be prefixed with '/'
app.use('/', routes);


// Error handling middleware
// This will catch any errors that occur in your route handlers
/*
err: The error object that was thrown or passed to the next() function.
req: The request object.
res: The response object.
next: The next middleware function in the stack.
*/
app.use((err, req, res, next) => {
  console.log('App.js catch all error handler');
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the app so we can use it in server.js
module.exports = app;