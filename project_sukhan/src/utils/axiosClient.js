import axios from "axios";
import { BASE_URL } from "../config/api";

const axiosClient = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

// token auto attach
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 auto logout
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
