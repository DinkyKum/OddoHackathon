import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:7777/users", { withCredentials: true })
      .then((response) => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (e, userId) => {
    e.preventDefault(); // prevent navigation due to Link
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:7777/users/${userId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("Failed to delete user.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Loading users...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-10">All Users</h1>

      <div className="flex flex-col gap-8">
        {users.map((user, index) => (
          <Link to={`/users/${user._id}`} key={user._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.photoUrl}
                      alt={user.firstName}
                      className="w-16 h-16 rounded-full border border-gray-600"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                      <p className="text-sm text-gray-400">{user.emailId}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, user._id)}
                    className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-4 text-gray-300">{user.about}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
