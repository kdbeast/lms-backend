import express from "express";
import upload from "../utils/multer.js";
import {
  editCourse,
  editLecture,
  createCourse,
  getCourseById,
  createLecture,
  deleteLecture,
  getLectureById,
  getAllAdminCourses,
  getLectureByCourseId,
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
router.route("/:courseId/lecture").get(isAuthenticated, getLectureByCourseId);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, deleteLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

export default router;
