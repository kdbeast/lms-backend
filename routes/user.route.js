import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/register").post(registerUser);
router.route("/profile").get(isAuthenticated, getUserProfile);

export default router;
