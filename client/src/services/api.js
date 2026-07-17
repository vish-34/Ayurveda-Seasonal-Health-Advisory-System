import axios from 'axios';

// Dev:  set VITE_API_URL=http://localhost:5000/api  in .env.local
// Prod: set VITE_API_URL=https://<your-app>.onrender.com/api  in Render dashboard
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://your-iks-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
