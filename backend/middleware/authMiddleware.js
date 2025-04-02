const jwt = require("jsonwebtoken");
const User = require('../models/User'); // Ensure User model is correctly imported

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Debugging

        const user = await User.findById(decoded.userId);
        console.log('Decoded User:', user); // Debugging

        if (!user) {
            return res.status(403).json({ message: 'Access Forbidden: User Not Found' });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Invalid Token' });
    }
};

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("🚨 No token found.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging the decoded token

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("🚨 User not found.");
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      console.log("🚨 Access denied. Not admin.");
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err);
    res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};


// Middleware to check for admin role
const adminOnly = (req, res, next) => {
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
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    console.error(`🚨 Role '${req.user?.role}' does not have access.`);
    return res.status(403).json({ message: "Access denied. Insufficient role." });
  }

  console.log("✅ Role authorized:", req.user.role);
  next();
};


module.exports = { authMiddleware, adminOnly, authorizeRoles, adminAuthMiddleware};

