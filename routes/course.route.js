import express from "express";
import upload from "../utils/multer.js";
import {
  editCourse,
  createCourse,
  getCourseById,
  createLecture,
  getAllAdminCourses,
} from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getAllAdminCourses);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);

export default router;
