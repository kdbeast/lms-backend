import express from "express";
import {
    markAsCompleted,
    markAsInCompleted,
    getCourseProgress,
    updateLectureProgress,
} from "../controllers/courseProgress.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router
  .route("/:courseId/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/completed").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incompleted").post(isAuthenticated, markAsInCompleted);

export default router;
