const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    

    // ✅ Return token along with the role in response
    res.status(200).json({ 
      token, 
      role: user.role   // ✅ Now the role will be sent to the frontend
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = (req, res) => {
  try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
          if (err) return res.status(403).json({ message: "Invalid refresh token" });

          const newToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
          res.json({ token: newToken });
      });
  } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};