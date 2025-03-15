import { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",  // ✅ Fixed route name
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,  // ✅ Use this for Vite
        //key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // ✅ Use environment variable
        amount: data.amount,
        currency: "INR",
        name: "Museum Ticket",
        description: "Purchase your museum ticket",
        order_id: data.orderId,  // ✅ Fixed order ID reference
        handler: async (response) => {
          console.log("✅ Payment Successful:", response);
  
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            { ...response },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          alert("✅ Payment Successful!");
        },
        prefill: { email: "user@example.com" },
        theme: { color: "#3399cc" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("❌ Payment failed!");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">💳 Payment</h2>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handlePayment}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mt-4"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
