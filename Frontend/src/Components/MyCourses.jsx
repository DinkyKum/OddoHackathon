import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentModal";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course/my-courses`, {
        withCredentials: true,
      });
      setCourses(res.data.courses);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              You don't have any active courses yet
            </p>
            <button
              onClick={() => navigate("/connections")}
              className="btn btn-primary"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const isTeacher =
                currentUser?._id === course.teacherId._id.toString();
              const otherUser = isTeacher ? course.studentId : course.teacherId;
              const role = isTeacher ? "Teacher" : "Student";

              return (
                <div
                  key={course._id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => window.open(`/course/${course._id}`, '_blank')}
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.status === "accepted"
                              ? "bg-green-600"
                              : course.status === "pending"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                        >
                          {course.status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600">
                          {role}
                        </span>
                        {course.isSwap && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600">
                            SWAP
                          </span>
                        )}
                        {!course.isSwap && course.fee && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600">
                            ${course.fee}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2">
                        {Array.isArray(course.skills)
                          ? course.skills.join(", ")
                          : course.skills}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={otherUser.photoUrl}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-600"
                    />
                    <div>
                      <p className="font-semibold">
                        {isTeacher ? "Teaching" : "Learning from"}:{" "}
                        {otherUser.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {otherUser.emailId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    {course.paymentStatus && (
                      <span
                        className={`px-2 py-1 rounded ${
                          course.paymentStatus === "paid"
                            ? "bg-green-600/30 text-green-400"
                            : "bg-yellow-600/30 text-yellow-400"
                        }`}
                      >
                        Payment: {course.paymentStatus.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {course.alliedCourse && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        Part of skill swap
                      </p>
                    </div>
                  )}
                  </div>

                  {/* Payment Button for Students with Pending Payment (Pay courses only) */}
                  {!isTeacher && 
                   !course.isSwap && 
                   course.status === "pending" && 
                   course.teacherAccepted && 
                   course.paymentStatus !== "paid" && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-yellow-400 mb-2">
                        Teacher has accepted. Complete payment to start learning.
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourse(course);
                          setShowPaymentModal(true);
                        }}
                        className="w-full btn btn-primary"
                      >
                        Pay ${course.fee} Now
                      </button>
                    </div>
                  )}

                  {/* Status Message for Teachers (Pay courses waiting for payment) */}
                  {isTeacher && 
                   !course.isSwap && 
                   course.status === "pending" && 
                   course.teacherAccepted && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-yellow-400">
                        ⏳ Waiting for student to complete payment of ${course.fee}
                      </p>
                    </div>
                  )}

                  {/* Status Message for Students - Swap courses waiting for teacher acceptance */}
                  {!isTeacher && 
                   course.isSwap && 
                   course.status === "pending" && 
                   !course.teacherAccepted && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-yellow-400">
                        ⏳ Waiting for teacher to accept your swap request
                      </p>
                    </div>
                  )}

                  {/* Status Message for Teachers - Swap courses waiting for their acceptance */}
                  {isTeacher && 
                   course.isSwap && 
                   course.status === "pending" && 
                   !course.teacherAccepted && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-blue-400">
                        📋 Swap course request - Accept in Course Requests
                      </p>
                    </div>
                  )}

                  {/* Swap courses - fully accessible after teacher accepts */}
                  {course.isSwap && course.status === "accepted" && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-green-400">
                        ✓ Course accepted - Ready to start learning!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedCourse && (
          <PaymentModal 
            course={selectedCourse} 
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedCourse(null);
              fetchMyCourses(); // Refresh courses after payment
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default MyCourses;

