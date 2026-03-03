import express from "express";
import upload from "../utils/multer.js";
import {
  syncUser,
  updateProfile,
  getEnrolledCourses,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Get enrolled courses
router.get("/enrolled-courses", auth, getEnrolledCourses);

// Update profile in MongoDB (optional)
router.post(
  "/profile/update",
  auth,
  upload.single("profilePhoto"),
  updateProfile,
);

router.post("/sync-user", auth, syncUser);

export default router;
