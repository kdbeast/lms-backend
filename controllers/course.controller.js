import mongoose from "mongoose";
import { uploadToR2 } from "../utils/r2.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Section } from "../models/section.model.js";

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
      creator: req.dbUser._id,
    });

    return res
      .status(201)
      .json({ course, message: "Course created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create course" });
  }
};

export const getAllAdminCourses = async (req, res) => {
  try {
    const userId = req.dbUser._id;
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
      courseThumbnail,
    } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
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

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== req.dbUser._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // find all sections of this course
    const sections = await Section.find({ courseId });

    for (const section of sections) {
      const lectures = await Lecture.find({
        _id: { $in: section.lectures },
      });

      // delete videos from cloudinary
      for (const lecture of lectures) {
        if (lecture.publicId) {
          await deleteFromCloudinary(lecture.publicId);
        }
      }

      // delete lectures
      await Lecture.deleteMany({
        _id: { $in: section.lectures },
      });
    }

    // delete sections
    await Section.deleteMany({ courseId });

    // delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
};

export const createLecture = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.params;
    const { lectureTitle, isPreviewFree, videoInfo, sectionId } = req.body;

    if (!lectureTitle || !courseId || !videoInfo?.videoUrl || !sectionId) {
      return res.status(400).json({
        message: "Lecture title, sectionId and video url are required",
      });
    }

    const section = await Section.findById(sectionId).session(session);

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const lecture = await Lecture.create(
      [
        {
          lectureTitle,
          isPreviewFree,
          videoUrl: videoInfo.videoUrl,
          videoKey: videoInfo.key,
          sectionId,
        },
      ],
      { session },
    );

    section.lectures.push(lecture[0]._id);
    await section.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      lecture: lecture[0],
      message: "Lecture created successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);

    return res.status(500).json({
      message: "Failed to create lecture",
    });
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

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, isPreviewFree, videoInfo } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found!" });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res
      .status(200)
      .json({ lecture, message: "Lecture updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to edit lecture" });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found!" });
    }

    // delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteFromCloudinary(lecture.publicId);
    }

    // delete lecture from course
    await Course.updateOne(
      { lectures: lectureId }, // find course with lecture id
      { $pull: { lectures: lectureId } }, // remove lecture from course
    );

    return res
      .status(200)
      .json({ lecture, message: "Lecture deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete lecture" });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const course = await Course.findById(lecture.courseId);

    // Check if instructor
    const isInstructor = course.creator.equals(userId);

    // Check if purchased
    const purchase = await CoursePurchase.findOne({
      userId,
      courseId: course._id,
      status: "completed",
    });

    const isPurchased = !!purchase;

    // Allow access if:
    if (!lecture.isPreviewFree && !isInstructor && !isPurchased) {
      return res.status(403).json({
        message: "You must purchase this course to access this lecture",
      });
    }

    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.error("Lecture access error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const {
      keyword = "",
      category = [],
      sortByPrice = "",
      priceRange = "",
    } = req.query;

    // create search criteria
    const searchCriteria = {
      isPublished: true,
    };

    // only apply $or search if query is provided and not just whitespace
    if (keyword && keyword.trim() !== "") {
      searchCriteria.$or = [
        { courseTitle: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { subTitle: { $regex: keyword, $options: "i" } },
      ];
    }

    // Ensure category is always an array
    const categories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : [];

    // if category is provided
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // if sortByPrice is provided
    const sortOptions = {};
    if (sortByPrice === "lowest") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "highest") {
      sortOptions.coursePrice = -1;
    } else if (sortByPrice === "newest") {
      sortOptions.createdAt = -1;
    } else if (sortByPrice === "oldest") {
      sortOptions.createdAt = 1;
    }

    if (priceRange) {
      let minPrice, maxPrice;

      try {
        [minPrice, maxPrice] = JSON.parse(priceRange);
      } catch (err) {
        return res.status(400).json({ message: "Invalid price range format" });
      }

      searchCriteria.coursePrice = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    const courses = await Course.find(searchCriteria)
      .populate({
        path: "creator",
        select: "name photoUrl",
      })
      .sort(sortOptions);

    return res.status(200).json({ courses: courses || [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to search courses" });
  }
};

export const getPublishedCourses = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    if (!courses) {
      return res.status(404).json({ message: "No published courses found" });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get published courses" });
  }
};

export const reorderLectures = async (req, res) => {
  try {
    const { lectures } = req.body;

    if (!Array.isArray(lectures)) {
      return res.status(400).json({
        message: "Lectures array is required",
      });
    }

    const bulkOps = lectures.map((lecture) => ({
      updateOne: {
        filter: { _id: lecture._id },
        update: { order: lecture.order },
      },
    }));

    await Lecture.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Lecture order updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to reorder lectures",
    });
  }
};

// publish course unpublished course
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    course.isPublished = publish === "true";
    await course.save();

    const message =
      publish === "true"
        ? "Course published successfully"
        : "Course unpublished successfully";

    return res.status(200).json({ course, message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update status" });
  }
};
