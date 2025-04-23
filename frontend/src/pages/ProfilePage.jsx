import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({ name: "", email: "" });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
      setEditMode(false);
      setUser(formData);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("❌ New passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">👤 User Profile</h2>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
            activeTab === "profile"
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-100 text-blue-700 hover:bg-blue-100"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Settings
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
            activeTab === "password"
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-100 text-blue-700 hover:bg-blue-100"
          }`}
          onClick={() => setActiveTab("password")}
        >
          🔒 Change Password
        </button>
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "profile" && user && (
            <>
              {!editMode ? (
               <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-4">
               {/* Avatar */}
               <div className="bg-blue-600 text-white w-24 h-24 flex items-center justify-center text-3xl font-bold rounded-full shadow-md">
                 {user.name?.charAt(0).toUpperCase()}
               </div>
             
               {/* Name & Role */}
               <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
               <p className="text-sm text-gray-600">👤 Role: {user.role || "User"}</p>
             
               {/* Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full px-4 text-sm">
                 <p><strong>📧 Email:</strong> {user.email}</p>
                 <p><strong>📱 Phone:</strong> {user.phone || "N/A"}</p>
                 <p><strong>🎂 Date of Birth:</strong> {user.dob || "N/A"}</p>
                 <p><strong>🏙️ City:</strong> {user.city || "N/A"}</p>
                 <p><strong>🌐 Country:</strong> {user.country || "N/A"}</p>
                 <p><strong>📅 Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
               </div>
             
               {/* Edit Button */}
               <button
                 onClick={() => setEditMode(true)}
                 className="bg-blue-500 text-white px-6 py-2 mt-2 rounded-full shadow-md hover:bg-blue-600 transition"
               >
                 ✏️ Edit Profile
               </button>
             </div>
             
              
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  { label: "City", name: "city", type: "text" },
                  { label: "Country", name: "country", type: "text" },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block mb-1 font-semibold">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}

                <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-green-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    💾 Save Profile
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
            </>
          )}

          {activeTab === "password" && (
            <div>
              {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => {
                const label = {
                  currentPassword: "Current Password",
                  newPassword: "New Password",
                  confirmPassword: "Confirm New Password",
                }[field];

                return (
                  <div key={index} className="relative mb-4">
                    <label className="block mb-1 font-semibold">{label}</label>
                    <input
                      type={showPassword[field.split("Password")[0]] ? "text" : "password"}
                      name={field}
                      value={passwordData[field]}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                      className="w-full border p-2 pr-10 rounded"
                    />
                    <span
                      onClick={() => toggleVisibility(field.split("Password")[0])}
                      className="absolute top-9 right-3 cursor-pointer text-xl"
                    >
                      {showPassword[field.split("Password")[0]] ? "👁️" : "🙈"}
                    </span>
                  </div>
                );
              })}

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handlePasswordChange}
                  className="bg-green-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
                >
                  🔐 Change Password
                </button>
                <button
                  onClick={() => {
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="bg-red-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
