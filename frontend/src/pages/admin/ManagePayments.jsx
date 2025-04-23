import { useEffect, useState } from "react";
import axios from "axios";

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all payments
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage

                const response = await axios.get("http://localhost:5000/api/payments", {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Send token in headers
                    },
                    withCredentials: true, // Ensure credentials are sent
                });

                setPayments(response.data);
            } catch (err) {
                console.error("Error fetching payments:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error fetching payments");
            }
            setLoading(false);
        };

        fetchPayments();
    }, []);

    // ✅ Handle Status Change
    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token"); // ✅ Retrieve token

            const response = await axios.put(
                `http://localhost:5000/api/payments/${id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Send token in headers
                    },
                    withCredentials: true,
                }
            );

            console.log("Payment updated:", response.data);

            // Update state
            setPayments((prev) =>
                prev.map((payment) =>
                    payment._id === id ? { ...payment, status: newStatus } : payment
                )
            );
        } catch (err) {
            console.error("Error updating payment status:", err.response?.data || err.message);
            alert("Error updating payment status: " + (err.response?.data?.message || err.message));
        }
    };

    // ✅ Handle Delete Payment
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payment?")) return;

        try {
            const token = localStorage.getItem("token"); // ✅ Retrieve token

            await axios.delete(`http://localhost:5000/api/payments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Send token in headers
                },
                withCredentials: true,
            });

            console.log("Payment deleted successfully");

            // Remove from state
            setPayments((prev) => prev.filter((payment) => payment._id !== id));
        } catch (err) {
            console.error("Error deleting payment:", err.response?.data || err.message);
            alert("Error deleting payment: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <p className="text-center p-4 text-gray-600">Loading payments...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Payments</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="border p-4 text-left">User</th>
                            <th className="border p-4 text-left">Amount</th>
                            <th className="border p-4 text-left">Status</th>
                            <th className="border p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-b hover:bg-gray-100">
                                <td className="p-4">{payment.userId?.name || "Unknown"}</td>
                                <td className="p-4">{payment.amount}</td>
                                <td className="p-4">
                                    <select
                                        value={payment.status}
                                        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                                        className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(payment._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePayments;
