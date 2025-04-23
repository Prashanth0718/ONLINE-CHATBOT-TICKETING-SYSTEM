const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User (Admin Only)
exports.updateUser = async (req, res) => {
  const { _id, name, email, phone, address, dob, city, country, role } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user fields
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.dob = dob;
    user.city = city;
    user.country = country;
    user.role = role;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Reset User Password (Admin Only)
exports.resetUserPassword = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPassword = Math.random().toString(36).slice(-8); // Generate random password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful", newPassword }); // Send the new password
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
