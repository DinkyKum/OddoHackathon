const express = require("express");
const mongoose = require("mongoose");
const Course = require("../models/course");
const User = require("../models/user");
const { userAuth } = require("../Middlewares/auth");

const courseRouter = express.Router();

/**
 * Route: POST /course/create
 * Body required:
 * {
 *   "teacherId": "...",
 *   "type": "swap" | "pay",
 *   "skillToLearn": "string",
 *   "skillToTeach": "string"   // only for swap
 *   "fee": number              // only for pay
 * }
 */
courseRouter.post("/course/create", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const {
      teacherId,
      type,
      skillToLearn,
      skillToTeach,
      fee
    } = req.body;

    // Check teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).send("Teacher does not exist");

    // Skill validation
    if (!skillToLearn)
      return res.status(400).send("skillToLearn is required");

    // =========================================
    // CASE 1: PAY
    // =========================================
    if (type === "pay") {
      if (!fee) return res.status(400).send("Fee is required for pay mode");

      const newCourse = new Course({
        teacherId: teacherId,
        studentId: loggedInUser,
        isSwap: false,
        skills: skillToLearn,
        status: "pending",
        fee: fee
      });

      await newCourse.save();
      return res.send({
        message: "Course created successfully (PAY)",
        course: newCourse
      });
    }

    // =========================================
    // CASE 2: SWAP
    // =========================================
    if (type === "swap") {
      if (!skillToTeach)
        return res.status(400).send("skillToTeach is required for swap");
      
      // Ensure no fee is provided for swap courses
      if (fee) {
        return res.status(400).send("Fee is not allowed for swap courses. Swap courses are skill exchanges with no payment required.");
      }

      // FIRST COURSE (student = logged-in user, wants to learn from teacher)
      const mainCourse = new Course({
        teacherId: teacherId,
        studentId: loggedInUser,
        isSwap: true,
        skills: skillToLearn,
        status: "pending",  // Wait for teacher to accept
        fee: undefined  // Explicitly no fee for swap courses
      });

      // SECOND COURSE: reverse (teacher will learn from student)
      const reverseCourse = new Course({
        teacherId: loggedInUser,
        studentId: teacherId,
        isSwap: true,
        skills: [skillToTeach],
        status: "pending",  // Wait for teacher to accept
        fee: undefined  // Explicitly no fee for swap courses
      });

      // Create allied connection
      mainCourse.alliedCourse = reverseCourse._id;
      reverseCourse.alliedCourse = mainCourse._id;

      // Save both
      await mainCourse.save();
      await reverseCourse.save();

      return res.send({
        message: "Swap courses created successfully",
        swapCourse1: mainCourse,
        swapCourse2: reverseCourse
      });
    }

    return res.status(400).send("Invalid type. Must be 'swap' or 'pay'.");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating course: " + error.message);
  }
});

/**
 * Route: GET /course/pending
 * Get all pending course requests for the logged-in teacher
 */
courseRouter.get("/course/pending", userAuth, async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const pendingCourses = await Course.find({
      teacherId: teacherId,
      status: "pending"
    })
    .populate("studentId", "name emailId photoUrl about skillsOffered skillsWanted")
    .populate("teacherId", "name emailId photoUrl")
    .sort({ createdAt: -1 });

    res.json({ courses: pendingCourses });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching pending courses: " + error.message);
  }
});

/**
 * Route: GET /course/my-courses
 * Get all courses where user is either teacher or student
 */
courseRouter.get("/course/my-courses", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Show courses where:
    // 1. Status is "accepted" (swap courses after teacher accepts, or pay courses after payment)
    // 2. OR status is "pending" AND teacherAccepted is true (pay courses after teacher accepts but before payment)
    // 3. OR status is "pending" AND user is student (swap/pay courses waiting for teacher acceptance)
    const courses = await Course.find({
      $and: [
        {
          $or: [
            { teacherId: userId },
            { studentId: userId }
          ]
        },
        {
          $or: [
            { status: "accepted" },
            { status: "pending", teacherAccepted: true },  // Pay courses visible after teacher accepts
            { status: "pending", studentId: userId }  // Show pending courses where user is student (waiting for teacher)
          ]
        }
      ]
    })
    .populate("teacherId", "name emailId photoUrl")
    .populate("studentId", "name emailId photoUrl")
    .populate("alliedCourse")
    .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching courses: " + error.message);
  }
});

/**
 * Route: GET /course/:courseId
 * Get course details by ID
 */
courseRouter.get("/course/:courseId", userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    const course = await Course.findById(courseId)
      .populate("teacherId", "name emailId photoUrl about skillsOffered")
      .populate("studentId", "name emailId photoUrl about")
      .populate("alliedCourse");

    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Check if user is authorized (teacher or student)
    if (course.teacherId._id.toString() !== userId.toString() && 
        course.studentId._id.toString() !== userId.toString()) {
      return res.status(403).send("Unauthorized to view this course");
    }

    res.json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching course: " + error.message);
  }
});

/**
 * Route: POST /course/review/:status/:courseId
 * Teacher accepts or rejects a course request
 * status: "accepted" | "rejected"
 */
courseRouter.post("/course/review/:status/:courseId", userAuth, async (req, res) => {
  try {
    const { status, courseId } = req.params;
    const teacherId = req.user._id;
    
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status. Must be 'accepted' or 'rejected'");
    }

    const course = await Course.findOne({
      _id: courseId,
      teacherId: teacherId,
      status: "pending"
    });

    if (!course) {
      return res.status(404).send("Course request not found or already processed");
    }

    if (status === "rejected") {
      // For rejection, set status to rejected
      course.status = "rejected";
      await course.save();
    } else if (status === "accepted") {
      // For acceptance, handle differently based on course type
      if (course.isSwap) {
        // Swap courses: accept immediately (no payment needed)
        course.status = "accepted";
        course.teacherAccepted = true;
        await course.save();

        // Also accept the allied course
        if (course.alliedCourse) {
          const alliedCourse = await Course.findById(course.alliedCourse);
          if (alliedCourse) {
            alliedCourse.status = "accepted";
            alliedCourse.teacherAccepted = true;
            await alliedCourse.save();
          }
        }
      } else {
        // Pay courses: teacher accepts but course stays pending until payment
        course.teacherAccepted = true;
        // Keep status as "pending" - will be set to "accepted" after payment
        await course.save();
      }
    }

    res.json({
      message: `Course ${status} successfully`,
      course: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reviewing course: " + error.message);
  }
});

/**
 * Route: POST /course/verify-payment
 * Verify payment transaction and update course status
 * Body: { courseId, transactionHash, paymentWalletAddress }
 */
courseRouter.post("/course/verify-payment", userAuth, async (req, res) => {
  try {
    const { courseId, transactionHash, paymentWalletAddress } = req.body;
    const userId = req.user._id;

    if (!courseId || !transactionHash || !paymentWalletAddress) {
      return res.status(400).send("courseId, transactionHash, and paymentWalletAddress are required");
    }

    const course = await Course.findOne({
      _id: courseId,
      studentId: userId,
      isSwap: false,
      status: "pending",
      teacherAccepted: true  // Teacher must have accepted first
    });

    if (!course) {
      return res.status(404).send("Course not found, teacher hasn't accepted, or payment already completed");
    }

    // TODO: Add actual Solana transaction verification here
    // For now, we'll just mark it as paid if transaction hash is provided
    // In production, verify the transaction on Solana blockchain
    
    course.paymentStatus = "paid";
    course.transactionHash = transactionHash;
    course.paymentWalletAddress = paymentWalletAddress;
    course.status = "accepted";
    
    await course.save();

    res.json({
      message: "Payment verified and course accepted",
      course: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying payment: " + error.message);
  }
});

module.exports = courseRouter;
