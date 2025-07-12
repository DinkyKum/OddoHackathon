import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState({ received: [], sent: [] });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests`, {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch connection requests", err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, { withCredentials: true });
      await fetchRequests(); // ✅ re-fetch updated list after action
    } catch (err) {
      console.error("Review request failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Received Requests */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Received Requests</h2>
          {requests.received.length === 0 ? (
            <p className="text-gray-400">No requests received yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.received.map((req) => (
                req.status === "pending" && (
                  <div
                    key={req._id}
                    className="bg-gray-800 rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{req.fromUserId.name}</h3>
                      <p className="text-sm text-gray-400">{req.fromUserId.about}</p>
                      <p className="text-sm font-medium mt-2">
                        Status: <span className="text-yellow-400">Pending</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        className="px-3 py-1 bg-green-600 rounded-md text-sm hover:bg-green-700"
                        onClick={() => reviewRequest("accepted", req._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700"
                        onClick={() => reviewRequest("rejected", req._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Sent Requests */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Sent Requests</h2>
          {requests.sent.length === 0 ? (
            <p className="text-gray-400">You haven't sent any requests yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.sent.map((req) =>
                req.status !== "interested" && (
                  <div
                    key={req._id}
                    className="bg-gray-800 rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{req.toUserId.name}</h3>
                      <p className="text-sm text-gray-400">{req.toUserId.about}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status: </span>
                      <span
                        className={`text-sm font-medium ${
                          req.status === "accepted" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ConnectionRequests;
