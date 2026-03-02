import express from "express";
import {
  markAsCompleted,
  markAsInCompleted,
  getCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

/* ---------- GET COURSE PROGRESS ---------- */
router.get("/:courseId", auth, getCourseProgress);

// /* ---------- UPDATE LECTURE VIEW ---------- */
router.post("/:courseId/lecture/:lectureId/view", auth, updateLectureProgress);

// /* ---------- MARK COURSE COMPLETED ---------- */
router.post("/:courseId/completed", auth, markAsCompleted);

/* ---------- MARK COURSE INCOMPLETED ---------- */
router.post("/:courseId/incompleted", auth, markAsInCompleted);

export default router;
