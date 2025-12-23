import axiosClient from "../utils/axiosClient";

export const adminService = {
  dashboard: () => axiosClient.get("/admin/dashboard"),

  getPoetNames : () => axiosClient.get(`admin/poets`),
  getPoets: (params) => axiosClient.get("/poets", { params }),
  createPoet: (d) => axiosClient.post("/admin/poet", d),
  updatePoet: (id,d) => axiosClient.put(`/admin/poet/${id}`, d),
  deletePoet: (id) => axiosClient.delete(`/admin/poet/${id}`),

  getPoems: () => axiosClient.get("/poems"),
  createPoem: (d) => axiosClient.post("/admin/poem", d),
  updatePoem: (id,d) => axiosClient.put(`/admin/poem/${id}`, d),
  deletePoem: (id) => axiosClient.delete(`/admin/poem/${id}`),
};
