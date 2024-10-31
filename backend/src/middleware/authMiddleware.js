// /middleware/authMiddleware.js
const admin = require('../configs/firebaseAuth');

// verifies if a session exists
exports.checkSessionAndPrivileges = (routePrivileges) => {
  console.log('Made it outside checkSessionAndPrivileges');
  const checkAndVerify = (req, res, next) => {
    console.log('Made it inside check and verify');
    console.log('Session:', req.session);
    console.log('SessionID:', req.sessionID);
    console.log('UserID:', req.session.userId);
    console.log('Is authenticated:', req.session.isAuthenticated);
    console.log('Privileges:', req.session.privileges);
    const userSession = req.session;
    const isAuthenticated = req.session.isAuthenticated;
    if (isAuthenticated) {
      const userPrivileges = req.session.privileges;
      console.log('Are authenticated. Privlidges is', userPrivileges);
      if (userPrivileges) {
        if (!routePrivileges || (userPrivileges && (userPrivileges === routePrivileges))){
          // no privileges required for route or privileges met
          console.log('Leaving inside check and verify 1');
          next();
        } else {
          console.log('User does not have required privileges');
          return res.status(403).send('User does not have required privileges');
        }
      } else {
        console.log('User does not have a current session');
        return res.status(401).send('User does not have a current session');
      }
    } else {
      console.log('User is not authenticated');
      return res.status(401).send('User is not authenticated');
    }
  }
  return checkAndVerify;
};

// const User = require('./models/User');  // MongoDB User model
// // Login route to authenticate and store session
// app.post('/login', async (req, res) => {
//   const { token } = req.body;

//   try {
//     // Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(token);

//     // Find the user in the database (get role/permissions)
//     const user = await User.findById(decodedToken.uid);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     // Store user information in session
//     req.session.user = {
//       uid: user._id,
//       email: user.email,
//       role: user.role,            // Store user role (e.g., 'admin', 'editor', 'viewer')
//       permissions: user.permissions  // Store permissions if applicable
//     };

//     res.send('Logged in successfully');
//   } catch (error) {
//     res.status(401).send('Invalid Firebase token');
//   }
// });

// // Sample protected route
// app.get('/admin/dashboard', (req, res) => {
//   if (req.session && req.session.user && req.session.user.role === 'admin') {
//     res.send('Welcome to the admin dashboard');
//   } else {
//     res.status(403).send('Access denied');
//   }
// });