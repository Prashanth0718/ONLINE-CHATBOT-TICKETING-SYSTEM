import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "./pages/ChatbotPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PlanVisit from './pages/PlanVisit';
import About from './pages/About';
import ProfilePage from "./pages/ProfilePage";
import BookTicket from "./pages/BookTicket";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import VerifyTicket from "./pages/VerifyTicket";
import "./App.css";
import "./index.css";
import Guide from './pages/Guide';
import Contact from './pages/Contact';
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import RefundPolicy from "./pages/legal/RefundPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";


function App() {
  return (
    <Router>
      
        <Navbar />
        
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify/:ticketId" element={<VerifyTicket />} />
            

            {/* ✅ Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/plan-visit" element={<PlanVisit />} />
              <Route path="/about" element={<About />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/book-ticket" element={<BookTicket />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            
            {/* 🚨 Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        
        
        <Footer />
      
    </Router>
  );
}

export default App;
