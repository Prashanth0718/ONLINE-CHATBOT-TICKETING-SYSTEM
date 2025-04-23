const User = require("../models/User");
const Ticket = require("../models/Ticket"); // Assuming you have a Ticket model
const bcrypt = require("bcryptjs"); // For hashing passwords

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate new email format
        if (req.body.email && !/\S+@\S+\.\S+/.test(req.body.email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Update user fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.dob = req.body.dob || user.dob;
        user.city = req.body.city || user.city;
        user.country = req.body.country || user.country;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user ticket history
const getUserTicketHistory = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id });
        res.json(tickets);
    } catch (error) {
        console.error("Error fetching ticket history:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash new password
        if (newPassword === currentPassword) {
            return res.status(400).json({ message: "New password cannot be the same as current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch all users (for admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Delete user (for admin)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user" });
    }
};

// Update user (for admin, e.g., reset password)
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            // Hash the new password if provided
            if (password === user.password) {
                return res.status(400).json({ message: "New password cannot be the same as the current one" });
            }
            user.password = await bcrypt.hash(password, 12);
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};


  

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserTicketHistory,
    changePassword,
    getAllUsers,
    deleteUser,
    updateUser,
};
