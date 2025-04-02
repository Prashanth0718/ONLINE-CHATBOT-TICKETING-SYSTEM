import { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortBy, setSortBy] = useState("name"); 
  const [roleFilter, setRoleFilter] = useState("all"); // New: Role filter
  const [showModal, setShowModal] = useState(false);
  const [userBookings, setUserBookings] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // New: Pagination limit
  const [selectedUserBookings, setSelectedUserBookings] = useState([]); // ✅ Add this state

  useEffect(() => {
    console.log("Updated Selected User Bookings:", selectedUserBookings);
    fetchUsers();
  }, [selectedUserBookings]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserBookings = async (userId) => {
    
    try {
      const token = localStorage.getItem("token");
      console.log(token); // ✅ Debugging token
      console.log(userId); // ✅ Debugging userId
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("User Bookings:", response.data);
      setSelectedUserBookings(response.data); // ✅ Store the bookings
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      setSelectedUserBookings([]); // ✅ Ensure empty state if no data
    }
  };
  

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/admin/users/update", editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const resetPassword = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/users/reset-password/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Password reset successful for User ID: ${id}`);
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter, Sort & Paginate Users
  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (roleFilter === "all" || user.role === roleFilter)
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Users</h3>

      {/* Search, Sorting & Filtering */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="border">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setEditingUser(user);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => fetchUserBookings(user._id)}
                >
                  View Bookings
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => resetPassword(user._id)}
                >
                  Reset Password
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* View Bookings */}
      {selectedUserBookings.length > 0 ? (
    <div className="space-y-4">
        {selectedUserBookings.map((booking) => (
            <div key={booking._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{booking.museumName}</h3>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Visitors:</strong> {booking.visitors}</p>
                <p><strong>Status:</strong> {booking.status}</p>

                {/* Action Buttons */}
                <div className="mt-3 flex space-x-2">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditBooking(booking)}
                    >
                        Edit
                    </button>

                    <button 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDeleteBooking(booking._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))}
    </div>
        ) : (
            <p>No bookings found for this user.</p>
        )}

    </div>
  );
};

export default UserManagement;
