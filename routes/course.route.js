import express from "express";
import upload from "../utils/multer.js";
import {
  editCourse,
  editLecture,
  createCourse,
  getCourseById,
  createLecture,
  deleteLecture,
  searchCourses,
  getLectureById,
  getAllAdminCourses,
  togglePublishCourse,
  getPublishedCourses,
  getLectureByCourseId,
} from "../controllers/course.controller.js";

import { clerkAuth } from "../middlewares/clerkAuth.js";
import { syncUser } from "../middlewares/syncUser.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */

// Anyone can see published courses
router.get("/published-courses", getPublishedCourses);

// Anyone can search
router.get("/search", searchCourses);

/* ---------- ADMIN ROUTES ---------- */

router.post("/", clerkAuth, syncUser, adminOnly, createCourse);

router.get("/", clerkAuth, syncUser, adminOnly, getAllAdminCourses);

router.put(
  "/:courseId",
  clerkAuth,
  syncUser,
  adminOnly,
  upload.single("courseThumbnail"),
  editCourse,
);

router.patch("/:courseId", clerkAuth, syncUser, adminOnly, togglePublishCourse);

router.post(
  "/:courseId/lecture",
  clerkAuth,
  syncUser,
  adminOnly,
  createLecture,
);

router.post(
  "/:courseId/lecture/:lectureId",
  clerkAuth,
  syncUser,
  adminOnly,
  editLecture,
);

router.delete(
  "/lecture/:lectureId",
  clerkAuth,
  syncUser,
  adminOnly,
  deleteLecture,
);

/* ---------- PROTECTED USER ROUTES ---------- */

router.get("/:courseId", clerkAuth, syncUser, getCourseById);

router.get("/:courseId/lecture", clerkAuth, syncUser, getLectureByCourseId);

router.get("/lecture/:lectureId", clerkAuth, syncUser, getLectureById);

export default router;
