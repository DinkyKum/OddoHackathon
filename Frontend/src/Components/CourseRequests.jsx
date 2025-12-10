import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const CourseRequests = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course/pending`, {
        withCredentials: true,
      });
      setPendingCourses(res.data.courses);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pending courses", err);
      setLoading(false);
    }
  };

  const reviewCourse = async (status, courseId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/course/review/${status}/${courseId}`,
        {},
        { withCredentials: true }
      );
      
      const updatedCourse = response.data.course;
      await fetchPendingCourses(); // Re-fetch after action
      
      // For swap courses, navigate to course page (immediately accepted)
      // For pay courses, course stays pending until payment - don't navigate
      if (status === "accepted") {
        if (updatedCourse && updatedCourse.isSwap) {
          // Swap courses are immediately accepted
          window.open(`/course/${courseId}`, '_blank');
        } else {
          // Pay courses - show message that student needs to pay
          alert("Course accepted! Student will need to complete payment to start learning.");
        }
      }
    } catch (err) {
      console.error("Review course failed", err);
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Loading course requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Course Requests</h1>

        {pendingCourses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No pending course requests</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={course.studentId.photoUrl}
                        alt={course.studentId.name}
                        className="w-16 h-16 rounded-full border-2 border-gray-600"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {course.studentId.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {course.studentId.emailId}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-300 mb-2">
                        <span className="font-semibold text-green-400">
                          Wants to learn:
                        </span>{" "}
                        {Array.isArray(course.skills)
                          ? course.skills.join(", ")
                          : course.skills}
                      </p>

                      {course.isSwap ? (
                        <p className="text-gray-300">
                          <span className="font-semibold text-blue-400">
                            Type:
                          </span>{" "}
                          Skill Swap
                        </p>
                      ) : (
                        <p className="text-gray-300">
                          <span className="font-semibold text-yellow-400">
                            Type:
                          </span>{" "}
                          Paid Course - Fee: ${course.fee}
                        </p>
                      )}

                      {course.studentId.about && (
                        <p className="text-gray-400 text-sm mt-2">
                          {course.studentId.about}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      Requested: {new Date(course.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-semibold transition-colors"
                      onClick={() => reviewCourse("accepted", course._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold transition-colors"
                      onClick={() => reviewCourse("rejected", course._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRequests;

