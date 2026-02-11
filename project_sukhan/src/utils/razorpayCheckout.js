

export const openRazorpayCheckout = ({
  order,
  key,
  user,
  onSuccess,
  onFailure
}) => {

  if (!window.Razorpay) {
    console.error("Razorpay SDK not loaded");
    if (onFailure) {
      onFailure({ message: "Payment SDK not loaded" });
    }
    return;
  }

  const options = {
    key, // Razorpay key_id
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    name: "Sukhan",
    description: "Secure Payment",

    handler: function (response) {
      // Razorpay successful payment response
      if (onSuccess) {
        onSuccess(response);
      }
    },

    prefill: {
      name: user?.name || "",
      email: user?.email || ""
    },

    theme: {
      color: "#04070d"
    }
  };

  const rzp = new window.Razorpay(options);

  // Handle payment failure
  rzp.on("payment.failed", function (response) {
    if (onFailure) {
      onFailure(response.error);
    }
  });

  rzp.open();
};
