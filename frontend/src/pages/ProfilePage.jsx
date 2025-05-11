import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { User, Mail, Phone, Calendar, MapPin, Globe, Edit2, Save, X, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import Toast from "../components/ui/Toast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendURL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendURL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(formData);
      setEditMode(false);
      showToast("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${backendURL}/api/users/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-2" />
                Profile Settings
              </h2>
            </div>

            <div className="p-6">
              <div className="flex justify-center space-x-4 mb-8">
                {["profile", "password"].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "profile" ? (
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Password
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      {!editMode ? (
                        <div className="bg-white rounded-xl p-6 space-y-6">
                          <div className="flex justify-center">
                            <motion.div
                              className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white"
                              whileHover={{ scale: 1.05 }}
                            >
                              {user?.name?.[0]?.toUpperCase()}
                            </motion.div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                              <User className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{user?.name}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Mail className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user?.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{user?.phone || "Not set"}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium">{user?.dob || "Not set"}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium">{user?.city || "Not set"}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Globe className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="font-medium">{user?.country || "Not set"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditMode(true)}
                              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Profile
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { label: "Name", name: "name", icon: User },
                              { label: "Email", name: "email", icon: Mail },
                              { label: "Phone", name: "phone", icon: Phone },
                              { label: "Date of Birth", name: "dob", icon: Calendar },
                              { label: "City", name: "city", icon: MapPin },
                              { label: "Country", name: "country", icon: Globe },
                            ].map((field) => (
                              <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                  <field.icon className="w-4 h-4 mr-2 text-blue-600" />
                                  {field.label}
                                </label>
                                <input
                                  type={field.name === "dob" ? "date" : "text"}
                                  name={field.name}
                                  value={formData[field.name] || ""}
                                  onChange={handleChange}
                                  className={`w-full px-4 py-2 rounded-xl border ${
                                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors[field.name] && (
                                  <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleUpdateProfile}
                              disabled={saving}
                              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                            >
                              {saving ? (
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              Save Changes
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditMode(false)}
                              disabled={saving}
                              className="flex items-center px-6 py-2 bg-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "password" && (
                    <div className="bg-white rounded-xl p-6 space-y-6">
                      {["current", "new", "confirm"].map((field) => (
                        <div key={field} className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-blue-600" />
                            {field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm Password"}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword[field] ? "text" : "password"}
                              value={passwordData[`${field}Password`]}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  [`${field}Password`]: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-2 rounded-xl border ${
                                errors[`${field}Password`] ? 'border-red-500' : 'border-gray-300'
                              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleVisibility(field)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword[field] ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors[`${field}Password`] && (
                            <p className="mt-1 text-sm text-red-500">{errors[`${field}Password`]}</p>
                          )}
                        </div>
                      ))}

                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePasswordChange}
                          disabled={saving}
                          className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4 mr-2" />
                          )}
                          Update Password
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProfilePage;