import { useState } from "react";
import { paymentService } from "@/services/payment.service";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startPayment = async ({
    amount,
    purpose = "public",
    name = "Sukhan",
    description = "Payment",
    onSuccess,
    onFailure,
  }) => {
    try {
      setLoading(true);
      setError(null);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      // Create order
      const { data } = await paymentService.createOrder({
        amount,
        purpose,
      });

      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name,
        description,
        order_id: order.id,
        handler: function (response) {
          if (onSuccess) onSuccess(response);
        },
        modal: {
          ondismiss: function () {
            if (onFailure) onFailure("Payment cancelled");
          },
        },
        theme: {
          color: "#04070d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed");
      if (onFailure) onFailure(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    startPayment,
    loading,
    error,
  };
};
