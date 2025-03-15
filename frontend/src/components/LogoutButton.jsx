import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // ✅ Immediately update the state
    navigate("/login");  // ✅ Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
