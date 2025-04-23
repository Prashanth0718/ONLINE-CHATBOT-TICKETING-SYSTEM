const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: false },
  dob: { type: Date, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Ensure role is included
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
