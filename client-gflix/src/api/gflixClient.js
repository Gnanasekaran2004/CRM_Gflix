import axios from 'axios';

const gflixApi = axios.create({
  baseURL: 'http://localhost:8080',
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
