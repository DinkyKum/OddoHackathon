import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:7777/users/${id}`)
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Loading user...
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-20 text-red-400 text-lg">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-8"
      >
        <Link to="/" className="text-blue-400 hover:underline text-sm mb-2 inline-block">
          ← Back to all users
        </Link>

        {/* Top Profile Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.photoUrl}
            alt={user.firstName}
            className="w-28 h-28 rounded-full border-4 border-gray-700 object-cover"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-wide">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-400">{user.emailId}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-300">
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Age:</strong> {user.age || "N/A"}</p>
              <p><strong>Location:</strong> {user.location || "N/A"}</p>
              <p><strong>Visibility:</strong> {user.visibility}</p>
              <p><strong>Rating:</strong> {user.rating}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <section>
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-300">{user.about}</p>
        </section>

        {/* Skills */}
        {user.skills?.length > 0 && (
          <SkillBlock title="General Skills" skills={user.skills} color="blue" />
        )}
        {user.skillsOffered?.length > 0 && (
          <SkillBlock title="Skills Offered" skills={user.skillsOffered} color="green" />
        )}
        {user.skillsWanted?.length > 0 && (
          <SkillBlock title="Skills Wanted" skills={user.skillsWanted} color="yellow" />
        )}
        {user.timeAvailability?.length > 0 && (
          <SkillBlock title="Time Availability" skills={user.timeAvailability} color="purple" />
        )}

        {/* Flags & Dates */}
        <div className="text-sm text-gray-400 border-t border-gray-800 pt-4 space-y-1">
          <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
          <p className="text-red-400"><strong>Banned:</strong> {user.isBanned ? "Yes" : "No"}</p>
          <p className="text-yellow-400"><strong>Spam:</strong> {user.isSpam ? "Yes" : "No"}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable SkillBlock component
const SkillBlock = ({ title, skills, color }) => {
  const bgColor =
    color === "blue"
      ? "bg-blue-700"
      : color === "green"
      ? "bg-green-700"
      : color === "yellow"
      ? "bg-yellow-600"
      : "bg-purple-700";

  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`px-3 py-1 text-sm rounded-full ${bgColor} text-white`}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};

export default UserDetails;
