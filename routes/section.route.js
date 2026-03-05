import express from "express";
import {
  createSection,
  getSectionsByCourseId,
} from "../controllers/section.controller.js";

const router = express.Router();

router.post("/create", createSection);

router.get("/:courseId", getSectionsByCourseId);

export default router;
