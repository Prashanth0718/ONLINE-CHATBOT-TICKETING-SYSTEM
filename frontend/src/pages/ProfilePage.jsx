import { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
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
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password changed successfully!");
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Manage Profile</h2>
      {user ? (
        <div>
          {!editMode ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <div>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full mb-2"/>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full mb-2"/>
              <button onClick={handleUpdateProfile} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                ✅ Save Changes
              </button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">
                ❌ Cancel
              </button>
            </div>
          )}

          {/* Change Password Section */}
          {!changePasswordMode ? (
            <button onClick={() => setChangePasswordMode(true)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
              🔒 Change Password
            </button>
          ) : (
            <div className="mt-4">
              <input type="password" name="currentPassword" placeholder="Current Password" 
                value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="border p-2 w-full mb-2"/>

              <input type="password" name="newPassword" placeholder="New Password" 
                value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border p-2 w-full mb-2"/>

              <input type="password" name="confirmPassword" placeholder="Confirm New Password" 
                value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="border p-2 w-full mb-2"/>

              <button onClick={handlePasswordChange} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                ✅ Change Password
              </button>
              <button onClick={() => setChangePasswordMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
