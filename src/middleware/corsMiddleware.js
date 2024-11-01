// this function will add the access control restrictions for request origins to the routes
exports.restrict = (req, res, next) => {
    console.log("ENTERING cors middleware");
    // set the headers in variables to query for errors below
    const allowedOrigins = [
      "http://localhost:3000",
      "https://learnos-client.vercel.app",
      "https://learnos-client-longthichcafes-projects.vercel.app",
      "https://learnos-client-git-main-longthichcafes-projects.vercel.app"
    ];
    const allowedMethods = "GET, POST, PUT, DELETE, OPTIONS";
    const allowedHeaders = "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization";
  
    // Check if the request origin is allowed
    const origin = req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Requests from ${origin} are not allowed.`,
      });
    }
  
    // set headers
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", allowedMethods);
    res.header("Access-Control-Allow-Headers", allowedHeaders);
    res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || allowedHeaders);
    res.header("Access-Control-Allow-Credentials", true);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    // Check if the request method is allowed
    if (!allowedMethods.split(', ').includes(req.method)) {
      return res.status(405).json({
        error: "Method Not Allowed",
        message: `The ${req.method} method is not allowed.`,
      });
    }
    
    // if everything is allowed, go to next
    console.log("Leaving cors middleware");
    next();
  };