const admin = require('../configs/firebaseAuth');

exports.signup = async (req, res) => {
    if (!token) {
      return res.status(401).send('Token missing');
    }
    try {} 
    catch (error) { }
  };
  
  // checks for a valid token. if found, create a session for user
  exports.login = async (req, res) => {
    console.log('Attempting to log in');
    
    try {
      // get token
      const authHeader = req.headers['authorization'];
      console.log('Recieved request');
      const token = authHeader && authHeader.split('Bearer ')[1]; // bearer token
      // check token exists
      if (!token) {
        return res.status(401).send('Token missing');
      }
      // decode token
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Sucessfully decoded token');
    //   req.session.userId = decodedToken.uid;
    //   req.session.privileges = 'admin';
    //   req.session.isAuthenticated = true;
      console.log("Session sucessfully set");
      res.status(200).send({ message: 'Logged in successfully' });
    } catch (error) {
      // if the token was invalid
      console.log('error on login:', error);
      res.status(403).send('Token invalid');
    }
  };

  // deletes sessions and redirects to hompage
  exports.logout = async (req, res) => {
    // delete session from storage
    try {
      req.session.destroy();
    } catch (error) {
      return res.status(500).send('Error loggin out');
    }
    // clear session cookie from users browser
    try {
      res.clearCookie('session')
    } catch (error) {
      return res.status(404).send('Session cookie not found');
    }
    // redirect after logout
    return res.status(200); //.redirect('./EntrancePage');
  };

// Check if a sesion exists for a user
exports.checkSessionExists = async (req, res) => {
  try {
    if (req.session && req.session.isAuthenticated) {
      res.status(200).send({message: 'Session exists for user', sessionExists: true});
    } else {
      res.status(200).send({message: 'Did not find session for user', sessionExists: false});
    }
  } catch (error) {
    res.status(500).send({message: 'Error checking for session', error});
  }
};
  
