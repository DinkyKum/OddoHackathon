import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <img
                  src={user.photoUrl}
                  alt={user.firstName}
                  className="w-16 h-16 rounded-full border border-gray-600"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-400">{user.emailId}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-300">{user.about}</p>

              {user.skills?.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-200">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-blue-700 text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
