import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";

export const createSection = async (req, res) => {
  try {
    const { sectionTitle, courseId } = req.body;

    if (!sectionTitle || !courseId) {
      return res.status(400).json({
        message: "Section title and courseId are required",
      });
    }

    const section = await Section.create({
      sectionTitle,
      courseId,
    });

    // attach section to course
    const course = await Course.findById(courseId);

    if (course) {
      course.sections.push(section._id);
      await course.save();
    }

    return res.status(201).json({
      success: true,
      section,
      message: "Section created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create section",
    });
  }
};

export const getSectionsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const sections = await Section.find({ courseId })
      .populate("lectures")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      sections,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch sections",
    });
  }
};
