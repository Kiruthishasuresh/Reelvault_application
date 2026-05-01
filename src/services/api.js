import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// Movie endpoints
export const movieAPI = {
  getAll: (params) => API.get("/movies", { params }),
  getOne: (id) => API.get(`/movies/${id}`),
  create: (data) => API.post("/movies", data),
  update: (id, data) => API.put(`/movies/${id}`, data),
  delete: (id) => API.delete(`/movies/${id}`),
};

export default API;
