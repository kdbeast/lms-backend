import express from "express";
import {
  createCourse,
  getAllAdminCourses,
} from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getAllAdminCourses);

export default router;
