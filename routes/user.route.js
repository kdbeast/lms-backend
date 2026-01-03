import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import upload from "../utils/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/register").post(registerUser);
router.route("/profile").get(isAuthenticated, getUserProfile);
router
  .route("/profile/update")
  .post(isAuthenticated, upload.single("profilePhoto"), updateProfile);

export default router;
