// bug_dashboard/src/assets/Componets/Admin Dashboard/config.js

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://bug-hunt-platform.vercel.app/api" 
  : "http://localhost:3000/api";

// Configure axios with proper CORS credentials
const configureAxios = (axios) => {
  // Set request configurations
  axios.defaults.withCredentials = true;
  
  // Add request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If token exists, add to Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor for error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to login on auth errors
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );
};

export { configureAxios };
export default API_BASE_URL;
