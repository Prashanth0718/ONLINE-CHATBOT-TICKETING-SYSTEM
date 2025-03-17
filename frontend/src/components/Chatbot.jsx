import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Stores chat messages
    const [session, setSession] = useState({});   // Stores chatbot session
    const [userMessage, setUserMessage] = useState(""); // User input
    const chatEndRef = useRef(null); // For auto-scrolling

    // Function to send message to chatbot API
    const sendMessage = async (message) => {
        let token = localStorage.getItem("token");
    
        // ✅ If token is expired, refresh it before making the request
        if (isTokenExpired(token)) {
            token = await refreshToken();
            if (!token) {
                alert("Session expired. Please log in again.");
                return;
            }
        }
    
        if (!message.trim()) return;
    
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setUserMessage("");
    
        try {
            const response = await axios.post(
                "http://localhost:5000/api/chatbot",
                { userMessage: message, session },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Fixed: Pass token correctly
            );
    
            const botMessage = response.data.response;
            setMessages([...newMessages, { text: botMessage.message, sender: "bot", options: botMessage.options || [] }]);
    
            // ✅ If Razorpay payment details are received, trigger Razorpay Checkout
            if (botMessage.orderId && botMessage.amount) {
                openRazorpayCheckout(botMessage);
            }
    
            setSession(response.data.session);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages([...newMessages, { text: "Error connecting to chatbot.", sender: "bot" }]);
        }
    };
    

    const openRazorpayCheckout = (paymentData) => {
        const options = {
            key: paymentData.key,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: "Museum Tickets",
            description: "Book your ticket",
            order_id: paymentData.orderId,
            handler: async function (response) {
                console.log("✅ Payment Successful:", response);
                
                // ✅ Send payment verification request to backend
                try {
                    console.log("📆 Frontend Sending Date:", session.selectedDate || "❌ No date found!");
                    const verifyResponse = await axios.post(
                        "http://localhost:5000/api/payment/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                    
                            // ✅ Use `session.selectedDate`
                            museumName: session.selectedMuseum,
                            date: session.selectedDate || new Date().toISOString().split("T")[0], // Default to today if missing
                            price: paymentData.amount / 100,
                            visitors: session.numTickets,
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    
    
                    if (verifyResponse.data.message === "Payment successful & Ticket booked") {
                        setTimeout(() => {
                            alert("✅ Ticket successfully booked!");
                        }, 500); // Delay the alert by 500ms                        
                    } else {
                        alert("❌ Payment verification failed.");
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                    alert("❌ Error verifying payment.");
                }
            },
            prefill: { email: "user@example.com" },
        };
    
        const rzp = new window.Razorpay(options);
        rzp.open();
    };
    
    
    
    
    
    // Function to check if JWT token is expired
    const isTokenExpired = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            return decoded.exp * 1000 < Date.now(); // Check expiry
        } catch (error) {
            return true; // Treat as expired if decoding fails
        }
    };
    
    // Function to refresh JWT token
    const refreshToken = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true });
            localStorage.setItem("token", response.data.token);
            return response.data.token;
        } catch (error) {
            console.error("Failed to refresh token", error);
            return null;
        }
    };
    
    

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col w-full max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg p-4">
            <div className="h-96 overflow-y-auto mb-2 p-2 border border-gray-300 rounded">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
                        <div className={`px-4 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {messages.length > 0 && messages[messages.length - 1].options?.length > 0 && (
                <div className="mb-2">
                    {messages[messages.length - 1].options.map((option, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => sendMessage(option)} // ✅ Ensure correct option is sent
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-1 hover:bg-blue-600 transition">
                            {option}
                        </button>
                    ))}
                </div>
            )}


            {/* Input Box & Send Button */}
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 border border-gray-400 p-2 rounded-l"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
                />
                <button onClick={() => sendMessage(userMessage)} className="bg-blue-500 text-white px-4 rounded-r">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
