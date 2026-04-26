import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ⚠️ make sure backend uses /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ FIXED interceptor
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (err) {
    console.log('No user in localStorage');
  }

  return config;
});

export default api;
