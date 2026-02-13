import axiosClient from "@/utils/axiosClient";

export const homeService = {
  getHome: async () => {
    const res = await axiosClient.get("/home");
    return res.data;
  }
};

