import axiosClient from "../utils/axiosClient";

export const authService = {
  loginUser: (data) => axiosClient.post("/auth/login", data).then(r => r.data),
  registerUser: (data) => axiosClient.post("/auth/register", data).then(r => r.data),
  logoutUser: () => axiosClient.post("/auth/logout").then(r => r.data),
  getProfile: () => axiosClient.get("/auth/profile").then(r => r.data),
  updateProfile: (data) => axiosClient.put("/auth/profile", data).then(r => r.data),
  deleteProfile: () => axiosClient.delete("/auth/profile").then(r => r.data),
  toggleLike: (id) => axiosClient.post(`/auth/like/${id}`).then(r => r.data),
  toggleSave: (id) => axiosClient.post(`/auth/save/${id}`).then(r => r.data),
  loadUser: () => axiosClient.get('/auth/loadUser').then(r=>r.data)
};
