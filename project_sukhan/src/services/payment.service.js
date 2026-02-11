import axiosClient from "../utils/axiosClient";

export const paymentService = {

    createOrder: (data) => axiosClient.post("/payment/create-order", data),
    getMyPayments: () => axiosClient.get("/payment/my"),
    getPaymentById: (id) => axiosClient.get(`/payment/${id}`)
};
