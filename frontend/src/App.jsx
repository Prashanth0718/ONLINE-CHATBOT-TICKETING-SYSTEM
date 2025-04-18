import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "./pages/ChatbotPage"; // Import the Chatbot page
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
//import Chatbot from "./components/Chatbot";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import BookTicket from "./pages/BookTicket";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      
        <Navbar />
        
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/book-ticket" element={<BookTicket />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            
            {/* ✅ Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
              <Route path="/my-tickets" element={<MyTickets />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/payment" element={<PaymentPage />} />
            {/* 🚨 Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        
        
        <Footer />
      
    </Router>
  );
}

export default App;
