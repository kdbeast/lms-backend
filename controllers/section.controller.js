import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

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
      .sort({ order: 1 });

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

export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const lectures = await Lecture.find({ _id: { $in: section.lectures } });

    for (const lecture of lectures) {
      if (lecture.publicId) {
        await deleteFromCloudinary(lecture.publicId);
      }
    }

    await Lecture.deleteMany({ _id: { $in: section.lectures } });

    // remove section from course
    await Course.findByIdAndUpdate(section.courseId, {
      $pull: { sections: sectionId },
    });

    // delete section
    await Section.findByIdAndDelete(sectionId);

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete section",
    });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { sectionTitle } = req.body;

    if (!sectionTitle) {
      return res.status(400).json({
        message: "Section title is required",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionTitle },
      { new: true },
    );

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      section,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update section",
    });
  }
};

export const reorderSections = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({
        message: "Sections array is required",
      });
    }

    const bulkOps = sections.map((section) => ({
      updateOne: {
        filter: { _id: section._id },
        update: { order: section.order },
      },
    }));

    await Section.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Section order updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to reorder sections",
    });
  }
};
