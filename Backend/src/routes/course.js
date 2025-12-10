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

      // FIRST COURSE (student = logged-in user)
      const mainCourse = new Course({
        teacherId: teacherId,
        studentId: loggedInUser,
        isSwap: true,
        skills: skillToLearn,
        status: "accepted"   // per your requirement
      });

      // SECOND COURSE: reverse
      const reverseCourse = new Course({
        teacherId: loggedInUser,
        studentId: teacherId,
        isSwap: true,
        skills: [skillToTeach],
        status: "pending"
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

module.exports = courseRouter;
