import express from "express";
import {
  createSection,
  deleteSection,
  updateSection,
  reorderSections,
  getSectionsByCourseId,
} from "../controllers/section.controller.js";

const router = express.Router();

router.post("/create", createSection);
router.patch("/reorder", reorderSections);
router.patch("/:sectionId", updateSection);
router.delete("/:sectionId", deleteSection);
router.get("/:courseId", getSectionsByCourseId);

export default router;
