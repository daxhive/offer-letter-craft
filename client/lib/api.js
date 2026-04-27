import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.log("No user in localStorage");
  }

  return config;
});

export default api;
