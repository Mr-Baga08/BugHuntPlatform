// bug_dashboard/src/assets/Componets/Admin Dashboard/config.js

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://bug-hunt-platform.vercel.app/api" 
  : "http://localhost:3000/api";

// Modify axios configuration to include credentials
const configureAxios = (axios) => {
  axios.defaults.withCredentials = true;
  
  // Add request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If token exists, add it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor to handle common errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle CORS errors
      if (error.message === 'Network Error') {
        console.error('A network error occurred. This could be a CORS issue.');
      }
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.error('Authentication error');
        // Optionally redirect to login
        // window.location.href = '/signin';
      }
      
      return Promise.reject(error);
    }
  );
};

export { configureAxios };
export default API_BASE_URL;
