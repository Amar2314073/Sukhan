import axiosClient from "../utils/axiosClient";

export const poemService = {
  getAllPoems: () => axiosClient.get("/poems").then(r => r.data),
  searchPoems: (q) => axiosClient.get("/poems/search", { params:{ q }}).then(r=>r.data),
  getPoemsByPoet: (id) => axiosClient.get(`/poems/poet/${id}`).then(r=>r.data),
  getPoemsByCategory: (id) => axiosClient.get(`/poems/category/${id}`).then(r=>r.data),
  getPoemById: (id) => axiosClient.get(`/poems/${id}`).then(r=>r.data),
  createPoem: (d) => axiosClient.post("/poems", d).then(r=>r.data),
  updatePoem: (id,d) => axiosClient.put(`/poems/update/${id}`, d).then(r=>r.data),
  deletePoem: (id) => axiosClient.delete(`/poems/delete/${id}`).then(r=>r.data),
};
