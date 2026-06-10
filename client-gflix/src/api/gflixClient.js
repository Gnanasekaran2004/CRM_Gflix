import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const gflixApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

gflixApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('gflix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

gflixApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gflix_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default gflixApi;
