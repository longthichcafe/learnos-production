const redis = require('redis');
const RedisStore = require('connect-redis').default;

// Create Redis client
const redisClient = redis.createClient();

// Handle Redis connection errors
// redisClient.connect().catch(console.error);
redisClient.connect()

// Set up rate limiter middleware
const sessionConfig = {
    store: new RedisStore({ client: redisClient }), // Use Redis as session store
    secret: process.env.SESSION_SECRET || 'mySecretKey', // Set the secret for signing the session ID
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }, // Set the session cookie options (e.g., maxAge)
};

module.exports = sessionConfig;