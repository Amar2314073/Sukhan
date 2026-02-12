import axiosClient from "@/utils/axiosClient";

export const poetOwnerService = {

  // Claim poet ownership
  submitClaim: (data) =>
    axiosClient.post("/poetOwner/claim", data),

  // Update own poet profile
  updatePoetProfile: (poetId, data) =>
    axiosClient.put(`/poetOwner/poet/${poetId}`, data),

  // Create poem for own poet
  createPoem: (poetId, data) =>
    axiosClient.post(`/poetOwner/poet/${poetId}/poems`, data),

  // Update own poem
  updatePoem: (poetId, poemId, data) =>
    axiosClient.put(`/poetOwner/poet/${poetId}/poems/${poemId}`, data),

  getMyPoet: (poetId) =>
    axiosClient.get(`/poets/${poetId}`),

  getMyPoems: (poetId) =>
    axiosClient.get(`/poets/${poetId}/poems`)
};
