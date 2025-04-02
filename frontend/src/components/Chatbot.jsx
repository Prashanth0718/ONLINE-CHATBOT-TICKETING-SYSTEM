import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Stores chat messages
    const [session, setSession] = useState({});   // Stores chatbot session
    const [userMessage, setUserMessage] = useState(""); // User input
    const [isTyping, setIsTyping] = useState(false); // Bot typing state
    const chatEndRef = useRef(null); // For auto-scrolling

    // Function to send message to chatbot API
    const sendMessage = async (message) => {
        if (!message.trim()) return;

        let token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            token = await refreshToken();
            if (!token) {
                alert("Session expired. Please log in again.");
                return;
            }
        }

        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setUserMessage("");
        setIsTyping(true); // Show typing indicator

        try {
            const response = await axios.post(
                "http://localhost:5000/api/chatbot",
                { userMessage: message, session },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const botMessage = response.data.response;
            setMessages([...newMessages, { text: botMessage.message, sender: "bot", options: botMessage.options || [] }]);

            if (botMessage.orderId && botMessage.amount) {
                openRazorpayCheckout(botMessage);
            }

            setSession(response.data.session);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages([...newMessages, { text: "Error connecting to chatbot.", sender: "bot" }]);
        } finally {
            setIsTyping(false); // Hide typing indicator
        }
    };

    // Razorpay Integration
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
                
                try {
                    const verifyResponse = await axios.post(
                        "http://localhost:5000/api/payment/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            museumName: session.selectedMuseum,
                            date: session.selectedDate || new Date().toISOString().split("T")[0],
                            price: paymentData.amount / 100,
                            visitors: session.numTickets,
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );

                    if (verifyResponse.data.message === "Payment successful & Ticket booked") {
                        setTimeout(() => {
                            alert("✅ Ticket successfully booked!");
                        }, 500);
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

    // Auto-scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4 border border-gray-300">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-2 border-b border-gray-300">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
                        <div className={`px-4 py-2 max-w-[80%] rounded-lg shadow-md ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md animate-pulse">
                            Bot is typing...
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Quick Reply Buttons */}
            {messages.length > 0 && messages[messages.length - 1].options?.length > 0 && (
                <div className="mb-2">
                    {messages[messages.length - 1].options.map((option, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => sendMessage(option)} 
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-1 hover:bg-blue-600 transition shadow">
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Box & Send Button */}
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 border border-gray-400 p-2 rounded-l outline-none focus:ring focus:ring-blue-300"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
                />
                <button 
                    onClick={() => sendMessage(userMessage)} 
                    className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
