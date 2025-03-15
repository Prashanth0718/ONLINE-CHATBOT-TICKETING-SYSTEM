import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Chatbot from "./components/Chatbot";
import PaymentPage from "./pages/PaymentPage";
import BookTicket from "./pages/BookTicket";
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book-ticket" element={<BookTicket />} />

            {/* ✅ Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
              <Route path="/my-tickets" element={<MyTickets />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
            <Route path="/payment" element={<PaymentPage />} />
            {/* 🚨 Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <div>
            {/* Other components */}
            <Chatbot />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
