import express from "express";
import upload from "../utils/multer.js";
import {
  editCourse,
  createCourse,
  getCourseById,
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

export default router;
