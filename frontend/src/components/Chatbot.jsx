import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TypingDots from "../components/TypingDots"; // Adjust the path as needed
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // or choose another theme
import emoji from 'emoji-dictionary';



const emojify = (text) =>
  text.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => emoji.getUnicode(name) || match);


const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [session, setSession] = useState({});
    const [userMessage, setUserMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("en"); // default to English
    const inputRef = useRef(null);

    

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        let token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            token = await refreshToken();
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate("/signin");
                return;
            }
        }

        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setUserMessage("");
        //inputRef.current?.focus();
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
            // Clear options to prevent duplicate clicks
            setMessages(prev => {
                const last = { ...prev[prev.length - 1], options: [] };
                return [...prev.slice(0, -1), last];
            });
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
                    
                            // 👇 Now send a message to continue the chatbot flow
                            setMessages(prev => [
                                ...prev,
                                {
                                    text: "🎉 Your ticket has been successfully booked!\n\nWould you like to do anything else?",
                                    sender: "bot",
                                    options: ["🔙 Main Menu", "📄 View My Tickets"]
                                }
                            ]);
                    
                            // Optionally reset session or update chatbot flow
                            setSession(prev => ({ ...prev, step: "main_menu" }));
                        }, 500);
                    }
                     else {
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
                { text: "👋 Welcome! Please type **Hi** to begin the conversation.", sender: "bot" }
            ]);
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
    }, [messages]);
    
    // useEffect(() => {
    //     if (messages.length === 0) {
    //         setMessages([
    //             {
    //                 text: "👋 Welcome! Please select your language to begin the conversation.",
    //                 sender: "bot",
    //                 options: ["English 🇬🇧", "हिंदी 🇮🇳", "ಕನ್ನಡ 🇮🇳", "తెలుగు 🇮🇳", "தமிழ் 🇮🇳"]
    //             }
    //         ]);
    //         setSession({ step: "select_language" }); // Add this so backend knows to expect a language selection
    //     }
    //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);
    
    
    return (
            
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-all duration-300 flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg p-4 border`}>

                
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
                className={`p-1 border rounded text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}

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
                                : `${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`
                        }`}>
                            <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold mb-2">{children}</h2>,
                                p: ({ children }) => <p className="mb-1">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                li: ({ children }) => <li className="ml-4">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-blue-600">{children}</strong>,
                                em: ({ children }) => <em className="italic text-purple-500">{children}</em>,
                                a: ({ href, children }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-500 hover:text-blue-700"
                                >
                                    {children}
                                </a>
                                ),
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                        className="rounded-lg my-2 text-sm"
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                    ) : (
                                    <code className="bg-gray-200 text-pink-600 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                                    );
                                }
                                
                            }}
                            >
                            {emojify(msg.text)}
                            </ReactMarkdown>


                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start px-4 py-2">
                        <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} px-3 py-2 rounded-lg shadow`}>

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
                        className={`w-full mt-1 p-2 rounded border focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                            darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                          }`}
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
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
                    className={`flex-1 px-4 py-2 rounded-l-md border focus:ring-2 focus:ring-blue-400 outline-none ${
                        darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                      }`}                      
                />
                <button
                onClick={() => sendMessage(userMessage)}
                className={`px-4 rounded-r-md transition font-medium ${
                    darkMode
                    ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                >
                Send
                </button>

            </div>
        </div>
    );
};

export default Chatbot;


//  {/* Chat area */}
// <div className="h-[400px] overflow-y-auto p-4 bg-white/20 rounded-xl border border-white/30 space-y-3 transition-all">
// {messages.map((msg, idx) => (
//     <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} transition-all duration-300`}>
//         <div className={`px-4 py-2 rounded-xl max-w-[75%] shadow-md ${
//             msg.sender === "user"
//                 ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
//                 : `${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`
//         }`}>
//             {msg.text}
//         </div>
//     </div>
// ))}
// {isTyping && (
//     <div className="flex justify-start px-4 py-2">
//         <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} px-3 py-2 rounded-lg shadow`}>

//             <TypingDots />
//         </div>
//     </div>
// )}

// <div ref={chatEndRef} />
// </div>