import React from "react";
import Chatbot from "../components/Chatbot"; // Importing the existing Chatbot component

const ChatbotPage = () => {
    return (
        <div className="container mx-auto p-4">
            <center>
            <h1 className="text-2xl font-bold mb-4">Museum Ticket Booking Chatbot</h1>
            </center>
            
            <Chatbot />
        </div>
    );
};

export default ChatbotPage;
