// axiosConfig.js
import axios from 'axios';

// Set default Axios configuration
// axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; // API base URL
axios.defaults.withCredentials = true; // Send cookies with every request

// Can also set other default headers if necessary, e.g., Content-Type
// axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;