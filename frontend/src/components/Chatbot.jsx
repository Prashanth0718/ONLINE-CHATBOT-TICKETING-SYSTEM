import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import emoji from 'emoji-dictionary';
import { Sun, Moon, Languages, Send, Bot, Calendar } from 'lucide-react';
import TypingDots from "../components/TypingDots";

const emojify = (text) =>
  text.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => emoji.getUnicode(name) || match);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState({});
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const inputRef = useRef(null);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    let token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      token = await refreshToken();
      if (!token) {
        alert("Session expired. Please logout and login again.");
        navigate("/signin");
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
      const replyText = botResponse.message || botResponse.reply || 
        (typeof botResponse === "string" ? botResponse : "🤖 Sorry, I didn't understand that.");

      const botMessage = {
        text: replyText,
        sender: "bot",
        options: botResponse.options || []
      };

      setMessages([...newMessages, botMessage]);
      
      if (botResponse.orderId && botResponse.amount) {
        openRazorpayCheckout(botResponse);
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
              setMessages(prev => [
                ...prev,
                {
                  text: "🎉 Your ticket has been successfully booked!\n\nWould you like to do anything else?",
                  sender: "bot",
                  options: ["🔙 Main Menu", "📄 View My Tickets"]
                }
              ]);
              setSession(prev => ({ ...prev, step: "main_menu" }));
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
      theme: { color: "#4F46E5" }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Museum Assistant</h2>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </motion.button>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`h-[500px] overflow-y-auto p-6 space-y-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold mb-2">{children}</h2>,
                        p: ({ children }) => <p className="mb-1">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                        li: ({ children }) => <li className="ml-4">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-blue-400">{children}</strong>,
                        em: ({ children }) => <em className="italic text-purple-400">{children}</em>,
                        code: ({ node, inline, className, children, ...props }) => {
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
                            <code className="bg-gray-700 text-pink-400 px-1 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {emojify(msg.text)}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className={`px-4 py-2 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <TypingDots />
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {session.step === "select_date" && (
            <div className="px-6 py-3 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline-block mr-1" />
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => e.target.value && sendMessage(e.target.value)}
              />
            </div>
          )}

          {messages.length > 0 && messages[messages.length - 1].options?.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 flex flex-wrap gap-2">
              {messages[messages.length - 1].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(option)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}

          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
                className={`flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(userMessage)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;