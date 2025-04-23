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
  const [loading, setLoading] = useState(true);

  //const [selectedUserBookings, setSelectedUserBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editedData, setEditedData] = useState({ museumName: "", visitors: "", status: "" });


  useEffect(() => {
    fetchUsers(); // Fetch only once when component mounts
}, []); 


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
  
      // Make sure the _id is included in the request
      if (!editingUser._id) {
        console.error("User ID is missing.");
        return;
      }
  
      console.log("Sending data:", editingUser);
  
      // PUT request to backend with editingUser data (including _id)
      await axios.put(
        "http://localhost:5000/api/admin/users/update", 
        editingUser, // Send the whole user object
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // After update, fetch the updated list of users and reset modal state
      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
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

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditedData({
        museumName: booking.museumName,
        visitors: booking.visitors,
        status: booking.status
    });
};

const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
        await axios.put(`http://localhost:5000/api/admin/bookings/${editingBooking._id}`, editedData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Booking updated successfully!");

        // Refresh the list
        fetchUserBookings(editingBooking.userId);
        setEditingBooking(null);
    } catch (error) {
        console.error("Error updating booking:", error);
    }
};

const handleDeleteBooking = async (bookingId) => {
  const token = localStorage.getItem("token"); // ✅ Fix: Define token  
  if (!window.confirm("Are you sure you want to delete this booking?")) return;

  try {
      await axios.delete(`http://localhost:5000/api/admin/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking deleted successfully!");
      fetchUserBookings(editingBooking.userId); // ✅ Fix: Use correct user ID
  } catch (error) {
      console.error("Error deleting booking:", error);
  }
};




const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        alert("User deleted successfully");

        // Refresh both users & analytics
        fetchUsers();
        fetchAnalytics();  // <== Force refresh analytics
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
  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-400 transition"
  onClick={() => {
    setEditingUser(user);
    setShowModal(true);
  }}
>
  Edit
                </button>
                <button
                className="bg-teal-500 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-teal-400 transition"
                onClick={() => fetchUserBookings(user._id)}
                >
                View Bookings
                </button>
                <button
                className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-yellow-400 transition"
                onClick={() => resetPassword(user._id)}
                >
                Reset Password
                </button>
                <button
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-red-400 transition"
                onClick={() => handleDeleteUser(user._id)}
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

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-3">Edit Booking</h3>

                        <label className="block">Museum Name:</label>
                        <input
                            type="text"
                            value={editedData.museumName}
                            onChange={(e) => setEditedData({ ...editedData, museumName: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />

                        <label className="block">Visitors:</label>
                        <input
                            type="number"
                            value={editedData.visitors}
                            onChange={(e) => setEditedData({ ...editedData, visitors: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />

                        <label className="block">Status:</label>
                        <select
                            value={editedData.status}
                            onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="booked">Booked</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="mt-4 flex space-x-2">
                            <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                            <button onClick={() => setEditingBooking(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        {/* Edit User Modal */}
{showModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-96 overflow-y-auto max-h-screen">
      <h3 className="text-lg font-semibold mb-3">Edit User</h3>

      <input
        type="text"
        value={editingUser.name}
        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
        placeholder="Name"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="email"
        value={editingUser.email}
        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
        placeholder="Email"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        value={editingUser.phone}
        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
        placeholder="Phone"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        value={editingUser.address}
        onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
        placeholder="Address"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="date"
        value={editingUser.dob?.substring(0, 10)} // Format for date input
        onChange={(e) => setEditingUser({ ...editingUser, dob: e.target.value })}
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        value={editingUser.city}
        onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
        placeholder="City"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        value={editingUser.country}
        onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
        placeholder="Country"
        className="border p-2 rounded w-full mb-2"
      />

      <select
        value={editingUser.role}
        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div className="flex justify-end">
        <button
          onClick={handleUpdateUser}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        
    </div>
  );
};

export default UserManagement;