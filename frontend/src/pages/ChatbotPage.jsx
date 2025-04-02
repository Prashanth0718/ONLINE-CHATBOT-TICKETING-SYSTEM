import React from "react";
import Chatbot from "../components/Chatbot"; // Importing the existing Chatbot component

const ChatbotPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Museum Chatbot</h1>
            <Chatbot />
        </div>
    );
};

export default ChatbotPage;
