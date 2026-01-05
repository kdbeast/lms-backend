import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res
        .status(400)
        .json({ message: "Course title and category are required" });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res
      .status(201)
      .json({ course, message: "Course created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create course" });
  }
};

export const getAllAdminCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });

    if (!courses) {
      return res.status(404).json({ message: "No courses found" });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get courses" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId); // delete old thumbnail
      }
      // upload new thumbnail
      const uploadResponse = await uploadToCloudinary(thumbnail.path);
      courseThumbnail = uploadResponse.secure_url;
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    };

    // Only add courseThumbnail if a new one was uploaded
    if (courseThumbnail) {
      updateData.courseThumbnail = courseThumbnail;
    }

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ course, message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to edit course" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get course by id" });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureTitle } = req.body;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture title is required" });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res
      .status(201)
      .json({ lecture, message: "Lecture created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create lecture" });
  }
};

export const getLectureByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({
      lectures: course.lectures,
      message: "Lectures fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get lectures" });
  }
};
