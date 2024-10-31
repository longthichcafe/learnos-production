const app = require('./app');   

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle any uncaught exceptions to prevent the server from crashing
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // optionally, can choose to exit the process here
    // process.exit(1);
});

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // optionally, can choose to exit the process here
    // process.exit(1);
});
