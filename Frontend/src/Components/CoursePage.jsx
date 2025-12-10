import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentModal";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.user);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course/${courseId}`, {
        withCredentials: true,
      });
      setCourse(res.data.course);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError(err.response?.data || "Failed to load course");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error || "Course not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isTeacher = currentUser?._id === course.teacherId._id.toString();
  const isStudent = currentUser?._id === course.studentId._id.toString();
  const otherUser = isTeacher ? course.studentId : course.teacherId;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/connections")}
            className="text-blue-400 hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Back to Connections
          </button>
          <h1 className="text-4xl font-bold mb-2">Course Details</h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                course.status === "accepted"
                  ? "bg-green-600"
                  : course.status === "pending"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {course.status.toUpperCase()}
            </span>
            {!course.isSwap && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  course.paymentStatus === "paid"
                    ? "bg-green-600"
                    : "bg-yellow-600"
                }`}
              >
                Payment: {course.paymentStatus?.toUpperCase() || "PENDING"}
              </span>
            )}
          </div>
        </div>

        {/* Course Info Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Course Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Type</p>
              <p className="text-lg font-semibold">
                {course.isSwap ? "Skill Swap" : "Paid Course"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Skills to Learn</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(course.skills) ? (
                  course.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                    {course.skills}
                  </span>
                )}
              </div>
            </div>

            {!course.isSwap && course.fee && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Course Fee</p>
                <p className="text-2xl font-bold text-green-400">${course.fee}</p>
              </div>
            )}

            {course.transactionHash && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Transaction Hash</p>
                <p className="text-xs font-mono text-blue-400 break-all">
                  {course.transactionHash}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-sm mb-1">Created</p>
              <p className="text-sm">
                {new Date(course.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Teacher Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-400">👨‍🏫</span> Teacher
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={course.teacherId.photoUrl}
                alt={course.teacherId.name}
                className="w-16 h-16 rounded-full border-2 border-gray-600"
              />
              <div>
                <p className="text-lg font-semibold">
                  {course.teacherId.name}
                </p>
                <p className="text-sm text-gray-400">
                  {course.teacherId.emailId}
                </p>
              </div>
            </div>
            {course.teacherId.about && (
              <p className="text-gray-300 text-sm">{course.teacherId.about}</p>
            )}
            {course.teacherId.skillsOffered && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Skills Offered</p>
                <div className="flex flex-wrap gap-2">
                  {course.teacherId.skillsOffered.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-600/30 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">👨‍🎓</span> Student
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={course.studentId.photoUrl}
                alt={course.studentId.name}
                className="w-16 h-16 rounded-full border-2 border-gray-600"
              />
              <div>
                <p className="text-lg font-semibold">
                  {course.studentId.name}
                </p>
                <p className="text-sm text-gray-400">
                  {course.studentId.emailId}
                </p>
              </div>
            </div>
            {course.studentId.about && (
              <p className="text-gray-300 text-sm">{course.studentId.about}</p>
            )}
          </div>
        </div>

        {/* Allied Course (for swaps) */}
        {course.isSwap && course.alliedCourse && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Allied Course (Swap)</h3>
            <p className="text-gray-300 mb-4">
              This is part of a skill swap. There is a corresponding course
              where roles are reversed.
            </p>
            <button
              onClick={() => {
                const alliedId = course.alliedCourse._id 
                  ? course.alliedCourse._id.toString() 
                  : course.alliedCourse.toString();
                window.open(`/course/${alliedId}`, '_blank');
              }}
              className="btn btn-primary"
            >
              View Allied Course (New Tab)
            </button>
          </div>
        )}

        {/* Payment Required Section (for students with pending payment - Pay courses only) */}
        {isStudent && 
         !course.isSwap && 
         course.status === "pending" && 
         course.teacherAccepted && 
         course.paymentStatus !== "paid" && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              ⚠️ Payment Required to Start Learning
            </h3>
            <p className="text-gray-300 mb-4">
              The teacher has accepted your course request. Please complete the payment of <span className="font-bold text-white">${course.fee}</span> using Solana (Phantom wallet) to start learning.
            </p>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-primary"
            >
              Pay ${course.fee} with Phantom Wallet
            </button>
          </div>
        )}

        {/* Waiting for Payment (for teachers - Pay courses only) */}
        {isTeacher && 
         !course.isSwap && 
         course.status === "pending" && 
         course.teacherAccepted && 
         course.paymentStatus !== "paid" && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              ⏳ Waiting for Student Payment
            </h3>
            <p className="text-gray-300">
              You have accepted this course. The student needs to complete payment of <span className="font-bold text-white">${course.fee}</span> before they can start learning.
            </p>
          </div>
        )}

        {/* Swap Course - Ready to Learn (visible immediately after teacher accepts) */}
        {course.isSwap && course.status === "accepted" && (
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">
              ✓ Course Accepted - Ready to Start!
            </h3>
            <p className="text-gray-300">
              This is a skill swap course. No payment required - both you and the teacher can start learning immediately.
            </p>
          </div>
        )}

        {/* Swap Course - Pending (waiting for teacher acceptance) */}
        {course.isSwap && course.status === "pending" && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              ⏳ Waiting for Teacher Acceptance
            </h3>
            <p className="text-gray-300">
              This is a skill swap course. No payment required - once the teacher accepts, you can start learning immediately.
            </p>
          </div>
        )}

        {/* Action Buttons - Only show if course is accepted (payment done for pay courses, or immediately for swap courses) */}
        {course.status === "accepted" && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Course Actions</h3>
            <div className="flex gap-4">
              <button className="btn btn-primary">
                Start Learning Session
              </button>
              <button className="btn btn-secondary">
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          course={course} 
          onClose={() => {
            setShowPaymentModal(false);
            fetchCourse(); // Refresh course data after payment
          }} 
        />
      )}
    </div>
  );
};

export default CoursePage;

