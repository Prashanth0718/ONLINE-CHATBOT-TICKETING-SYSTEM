import React from "react";
import axios from "axios";

const PaymentButton = ({ orderId, amount, userId }) => {
  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay Key
      amount: amount, 
      currency: "INR",
      name: "Museum Tickets",
      description: "Booking for Museum",
      order_id: orderId, 
      handler: async function (response) {
        const verifyResponse = await axios.post("http://localhost:5000/api/payment/verify", {
          userId,
          orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });

        if (verifyResponse.data.success) {
          alert("Payment Successful! Your tickets are booked.");
        } else {
          alert("Payment Failed. Please try again.");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment} className="bg-blue-500 text-white px-4 py-2 rounded">
      Proceed to Payment
    </button>
  );
};

export default PaymentButton;
