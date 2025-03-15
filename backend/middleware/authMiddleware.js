const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (check if user is authenticated)
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token
  console.log("🔍 Received Token:", token); // Debugging token

  if (!token) {
    console.error("🚨 No token provided.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    req.user = await User.findById(decoded.userId).select("-password"); 
    console.log("🛠 Found User in DB:", req.user);

    if (!req.user) {
      console.error("🚨 User not found in database.");
      return res.status(401).json({ message: "User not found" });
    }

    next(); // Proceed
  } catch (err) {
    console.error("❌ JWT Auth Error:", err);
    return res.status(400).json({ message: "Invalid token." });
  }
};



// Middleware to check for admin role
const adminOnly = (req, res, next) => {
  console.log("🔍 Checking Admin Access for:", req.user);

  if (!req.user) {
    console.error("🚨 User not found in request.");
    return res.status(403).json({ message: "Access denied. No user data found." });
  }

  if (req.user.role !== "admin") {
    console.error(`🚨 Access denied. User role is '${req.user.role}', not 'admin'.`);
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  console.log("✅ User is Admin. Proceeding...");
  next();
};


// Middleware to check for specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔍 Checking role:", req.user?.role);

    if (!req.user || !roles.includes(req.user.role)) {
      console.error(`🚨 Role '${req.user?.role}' does not have access.`);
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }

    console.log("✅ Role authorized:", req.user.role);
    next();
  };
};


module.exports = { authMiddleware, adminOnly, authorizeRoles };
