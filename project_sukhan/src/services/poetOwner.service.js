import axiosClient from "@/utils/axiosClient";

export const poetOwnerService = {

  // Claim poet ownership
  submitClaim: (data) =>
    axiosClient.post("/poetOwner/claim", data),

  // Update own poet profile
  updatePoetProfile: (data) =>
    axiosClient.put("/poetOwner/poet", data),

  // Create poem for own poet
  createPoem: (data) =>
    axiosClient.post("/poetOwner/poems", data),

  // Update own poem
  updatePoem: (poemId, data) =>
    axiosClient.put(`/poetOwner/poems/${poemId}`, data),

  getMyPoet: (poetId) =>
    axiosClient.get(`/poets/${poetId}`),

  getMyPoems: (poetId) =>
    axiosClient.get(`/poets/${poetId}/poems`)
};
