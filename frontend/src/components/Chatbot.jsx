import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TypingDots from "../components/TypingDots"; // Adjust the path as needed

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [session, setSession] = useState({});
    const [userMessage, setUserMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("en"); // default to English
    

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
        setIsTyping(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/chatbot",
                { userMessage: message, session, language },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const botResponse = response.data.response || {};
            const replyText = botResponse.message || botResponse.reply || (typeof botResponse === "string" ? botResponse : "🤖 Sorry, I didn't understand that.");

            const botMessage = {
                text: replyText,
                sender: "bot",
                options: botResponse.options || []
            };

            setMessages([...newMessages, botMessage]);

            if (botResponse.orderId && botResponse.amount) {
                openRazorpayCheckout(botResponse);
            }

            setSession(response.data.session);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages([...newMessages, { text: "❌ Error connecting to chatbot.", sender: "bot" }]);
        } finally {
            setIsTyping(false);
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
            method: { upi: true, card: false },
            theme: { color: "#3399cc" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const isTokenExpired = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true });
            localStorage.setItem("token", response.data.token);
            return response.data.token;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { text: "👋 Welcome! Please type *Hi* to begin the conversation.", sender: "bot" }
            ]);
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
                
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-all duration-300 flex flex-col w-full max-w-md mx-auto shadow-lg rounded-lg p-4 border`}>
                
        <h2 className="text-xl font-bold mb-4 text-center">🤖 Chatbot</h2>
        <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">🌗 Toggle Dark Mode</span>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 font-medium ${
                        darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"
                    }`}
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
        </div>

        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold">🌐 Select Language</span>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-1 border rounded text-sm bg-white text-black"
            >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
            </select>
        </div>


        {/* Chat area */}
            <div className="h-[400px] overflow-y-auto p-4 bg-white/20 rounded-xl border border-white/30 space-y-3 transition-all">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} transition-all duration-300`}>
                        <div className={`px-4 py-2 rounded-xl max-w-[75%] shadow-md ${
                            msg.sender === "user"
                                ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                                : "bg-white text-gray-900"
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start px-4 py-2">
                        <div className="bg-gray-200 px-3 py-2 rounded-lg shadow">
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Date Picker */}
            {session.step === "select_date" && (
                <div className="mt-3">
                    <label className="text-sm text-gray-700">📅 Choose a date:</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full mt-1 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        onChange={(e) => e.target.value && sendMessage(e.target.value)}
                    />
                </div>
            )}

            {/* Option Buttons */}
            {messages.length > 0 && messages[messages.length - 1].options?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {messages[messages.length - 1].options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => sendMessage(option)}
                            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="mt-4 flex">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
                    className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                    onClick={() => sendMessage(userMessage)}
                    className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
