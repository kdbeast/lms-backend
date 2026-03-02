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

import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */

// Anyone can see published courses
router.get("/published-courses", getPublishedCourses);

// Anyone can search
router.get("/search", searchCourses);

// /* ---------- ADMIN ROUTES ---------- */

router.post("/", auth, adminOnly, createCourse);

router.get("/", auth, adminOnly, getAllAdminCourses);

router.put(
  "/:courseId",
  auth,
  adminOnly,
  upload.single("courseThumbnail"),
  editCourse,
);

router.patch("/:courseId", auth, adminOnly, togglePublishCourse);

router.post("/:courseId/lecture", auth, adminOnly, createLecture);

router.post("/:courseId/lecture/:lectureId", auth, adminOnly, editLecture);

router.delete("/lecture/:lectureId", auth, adminOnly, deleteLecture);

// /* ---------- PROTECTED USER ROUTES ---------- */

router.get("/:courseId", auth, getCourseById);

router.get("/:courseId/lecture", auth, getLectureByCourseId);

router.get("/lecture/:lectureId", auth, getLectureById);

export default router;
