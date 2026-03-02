import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0].emailAddress;
    const name = clerkUser.fullName;
    const role = clerkUser.unsafeMetadata.role;

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
        email,
        name,
        role,
      });
    } else {
      return res.status(200).json({ success: true, user });
    }

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sync failed" });
  }
};

/* ---------- GET PROFILE ---------- */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.dbUser._id)
      .select("-password")
      .populate("enrolledCourses");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

/* ---------- UPDATE PROFILE ---------- */
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findOne({
      clerkUserId: req.auth.userId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let photoUrl = user.photoUrl;

    if (profilePhoto) {
      if (user.photoUrl) {
        const public_id = user.photoUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(public_id);
      }

      const cloudinaryResponse = await uploadToCloudinary(profilePhoto.path);
      photoUrl = cloudinaryResponse.secure_url;
    }

    user.name = name || user.name;
    user.photoUrl = photoUrl;

    await user.save();

    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/* ---------- ENROLLED COURSES ---------- */
export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.auth.userId,
    });
    return res.json(user);
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
