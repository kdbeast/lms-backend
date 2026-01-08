import bcrypt from "bcryptjs";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if(!name){
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if(!email){
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if(!password){
      return res.status(400).json({ success: false, message: "Password is required" });
    }
    if(!role){
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRes = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    return generateToken(res, userRes, `Welcome ${userRes.name}`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    return generateToken(res, user, `Welcome ${user.name}`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to login user",
    });
  }
};

export const logoutUser = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to logout user",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get user profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // extract the public_id from the photoUrl
    if (user.photoUrl) {
      const public_id = user.photoUrl.split("/").pop().split(".")[0];
      deleteFromCloudinary(public_id);
    }

    const cloudinaryResponse = await uploadToCloudinary(profilePhoto.path);
    const { secure_url: photoUrl } = cloudinaryResponse;

    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update profile",
    });
  }
};
