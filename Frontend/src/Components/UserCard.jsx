import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  const sendRequest = async (userId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/interested/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl mt-10 bg-base-200 border-[3px] border-gray-300 rounded-[2.5rem] px-10 py-8 flex items-center justify-between text-white shadow-md">
      
      {/* Profile Photo */}
      <div className="w-36 h-36 rounded-full border-[5px] border-gray-300 overflow-hidden flex items-center justify-center">
        <img
          src={user.photoUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 px-8">
        <h2 className="text-3xl font-semibold mb-4">{user.firstName} {user.lastName}</h2>

        {/* Skills Offered */}
        <div className="mb-2">
          <span className="text-green-400 font-medium">Skills Offered =&gt;</span>
          <div className="mt-1 flex flex-wrap gap-3">
            {user.skillsOffered?.map((skill, idx) => (
              <span key={idx} className="border-[2px] border-white rounded-full px-4 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-3">
          <span className="text-blue-400 font-medium">Skill wanted =&gt;</span>
          <div className="mt-1 flex flex-wrap gap-3">
            {user.skillsWanted?.map((skill, idx) => (
              <span key={idx} className="border-[2px] border-white rounded-full px-4 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Request & Rating */}
      <div className="flex flex-col items-center justify-between h-full">
        <button
          onClick={() => sendRequest(user._id)}
          className="bg-[#0A555F] hover:bg-[#11757e] text-white font-semibold text-lg px-6 py-2 rounded-2xl border-[4px] border-gray-300"
        >
          Request
        </button>
        <p className="mt-6 text-md">
          rating <span className="font-bold text-lg">{user.rating || 'N/A'}/5</span>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
