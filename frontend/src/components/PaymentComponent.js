import React, { useState } from "react";
import axios from "axios";

const PaymentComponent = ({ price, museumName, date }) => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    try {
      // 1. Create the Razorpay order on the server
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: price,
        currency: "INR", // You can change it based on your currency
      });

      const { orderId, amount, currency } = res.data;

      // 2. Initialize Razorpay payment modal
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Museum Ticket Booking",
        description: museumName,
        order_id: orderId,
        handler: async function (response) {
          // 3. After payment completion, verify payment
          const paymentData = {
            razorpay_order_id: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            museumName,
            date,
            price,
          };

          try {
            const verifyResponse = await axios.post("http://localhost:5000/api/payment/verify", paymentData);
            alert("Payment successful & Ticket booked!");
          } catch (error) {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Error initiating payment:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{museumName}</h2>
      <p>Date: {date}</p>
      <p>Price: ₹{price}</p>
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentComponent;
