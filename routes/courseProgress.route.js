import express from "express";
import {
  markAsCompleted,
  markAsInCompleted,
  getCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";

import { clerkAuth } from "../middlewares/clerkAuth.js";
import { syncUser } from "../middlewares/syncUser.js";

const router = express.Router();

/* ---------- GET COURSE PROGRESS ---------- */
router.get("/:courseId", clerkAuth, syncUser, getCourseProgress);

/* ---------- UPDATE LECTURE VIEW ---------- */
router.post(
  "/:courseId/lecture/:lectureId/view",
  clerkAuth,
  syncUser,
  updateLectureProgress,
);

/* ---------- MARK COURSE COMPLETED ---------- */
router.post("/:courseId/completed", clerkAuth, syncUser, markAsCompleted);

/* ---------- MARK COURSE INCOMPLETED ---------- */
router.post("/:courseId/incompleted", clerkAuth, syncUser, markAsInCompleted);

export default router;
