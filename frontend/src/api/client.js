import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Interceptor to inject tenant slug & auth token into every request
api.interceptors.request.use((config) => {
  // Hardcoded to our seeded tenant slug for now
  config.headers['x-tenant-slug'] = 'apex-health';

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;