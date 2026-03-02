import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  stripeWebhook,
  createCheckoutSession,
  getAllPurchasedCourse,
  getPurchaseCourseDetailWithPurchaseStatus,
} from "../controllers/purchaseCourse.controller.js";

const router = express.Router();

/* ---------- CHECKOUT ---------- */
router.post("/checkout/create-checkout-session", auth, createCheckoutSession);

// /* ---------- STRIPE WEBHOOK (PUBLIC) ---------- */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// /* ---------- PURCHASE DETAILS ---------- */
router.get(
  "/course/:courseId/detail-with-status",
  auth,
  getPurchaseCourseDetailWithPurchaseStatus,
);

// /* ---------- ALL PURCHASED COURSES ---------- */
router.get("/", auth, getAllPurchasedCourse);

export default router;
