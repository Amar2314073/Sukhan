import React, { useState } from "react";
import { usePayment } from "../hooks/usePayment";
import { openRazorpayCheckout } from "../utils/razorpayCheckout";


const PaymentButton = ({
  amount,
  purpose,
  label = "Pay Now",
  className = "",
  disabled = false,
  onSuccess,
  onError
}) => {
  const { createOrder, loading } = usePayment();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Create order from backend
      const data = await createOrder({ amount, purpose });

      if (!data?.order?.id) {
        throw new Error("Order creation failed");
      }

      // Open Razorpay Checkout
      openRazorpayCheckout({
        orderId: data.order.id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Sukhan",
        description: purpose,
        onSuccess: (response) => {
          if (onSuccess) onSuccess(response);
        },
        onError: (err) => {
          if (onError) onError(err);
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      if (onError) onError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading || processing}
      className={className}
    >
      {processing ? "Processing..." : label}
    </button>
  );
};

export default PaymentButton;
