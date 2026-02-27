import express from "express";
import upload from "../utils/multer.js";
import {
  getEnrolledCourses,
  updateProfile,
} from "../controllers/user.controller.js";
import { syncUser } from "../middlewares/syncUser.js";
import { clerkAuth } from "../middlewares/clerkAuth.js";

const router = express.Router();

// Get enrolled courses
router.get("/enrolled-courses", clerkAuth, syncUser, getEnrolledCourses);

// Update profile in MongoDB (optional)
router.post(
  "/profile/update",
  clerkAuth,
  syncUser,
  upload.single("profilePhoto"),
  updateProfile,
);

export default router;
