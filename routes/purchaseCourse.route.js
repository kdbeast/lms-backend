import express from "express";
import {
  stripeWebhook,
  createCheckoutSession,
  getAllPurchasedCourse,
  getPurchaseCourseDetailWithPurchaseStatus,
} from "../controllers/purchaseCourse.controller.js";

import { clerkAuth } from "../middlewares/clerkAuth.js";
import { syncUser } from "../middlewares/syncUser.js";

const router = express.Router();

/* ---------- CHECKOUT ---------- */
router.post(
  "/checkout/create-checkout-session",
  clerkAuth,
  syncUser,
  createCheckoutSession,
);

/* ---------- STRIPE WEBHOOK (PUBLIC) ---------- */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

/* ---------- PURCHASE DETAILS ---------- */
router.get(
  "/course/:courseId/detail-with-status",
  clerkAuth,
  syncUser,
  getPurchaseCourseDetailWithPurchaseStatus,
);

/* ---------- ALL PURCHASED COURSES ---------- */
router.get("/", clerkAuth, syncUser, getAllPurchasedCourse);

export default router;
