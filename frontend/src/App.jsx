import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "./pages/ChatbotPage"; // Import the Chatbot page
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PlanVisit from './pages/PlanVisit';
//import Chatbot from "./components/Chatbot";
import About from './pages/About';
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import BookTicket from "./pages/BookTicket";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import "./App.css";
import "./index.css";
import Guide from './pages/Guide';

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
            <Route path="/plan-visit" element={<PlanVisit />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
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
