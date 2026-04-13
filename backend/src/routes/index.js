/**
 * SOLID - ISP: Each router is focused only on its domain.
 * Routes are thin — only connect HTTP path to controller.
 * No business logic in routes.
 */

import express from "express";
import authenticate from "../middleware/authenticate.js";
import { authLimiter, paymentLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import {
  register, login,
  createListing, getListings, getListingById, updateListing, deleteListing, getMyListings,
  getProfile, updateProfile, getPublicUser,
  toggleSaved, getSaved,
  getNotifications, markNotificationRead,
  onboardSeller, createPaymentOrder, verifyPayment,
  getBuyerOrders, getSellerOrders,
} from "../controllers/index.js";
import upload from "../middleware/upload.js";

// ── Auth Routes ──────────────────────────────────────
export const authRouter = express.Router();
authRouter.post("/signup", authLimiter.middleware(), register);
authRouter.post("/login", authLimiter.middleware(), login);

// ── Listing Routes ───────────────────────────────────
export const listingRouter = express.Router();
listingRouter.get("/", generalLimiter.middleware(), getListings);
listingRouter.get("/my", authenticate, getMyListings);
listingRouter.get("/:id", generalLimiter.middleware(), getListingById);
listingRouter.post("/", authenticate, upload.array("images", 5), createListing);
listingRouter.put("/:id", authenticate, upload.array("images", 5), updateListing);
listingRouter.delete("/:id", authenticate, deleteListing);

// ── Profile Routes ───────────────────────────────────
export const profileRouter = express.Router();
profileRouter.get("/", authenticate, getProfile);
profileRouter.put("/", authenticate, upload.single("profilePhoto"), updateProfile);
profileRouter.get("/public/:id", getPublicUser);

// ── Saved / Wishlist Routes ──────────────────────────
export const savedRouter = express.Router();
savedRouter.post("/:listingId", authenticate, toggleSaved);
savedRouter.get("/", authenticate, getSaved);

// ── Notification Routes ──────────────────────────────
export const notificationRouter = express.Router();
notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.patch("/:id/read", authenticate, markNotificationRead);

// ── Payment Routes ───────────────────────────────────
export const paymentRouter = express.Router();
paymentRouter.post("/seller/onboard", authenticate, paymentLimiter.middleware(), onboardSeller);
paymentRouter.post("/pay/:listingId", authenticate, paymentLimiter.middleware(), createPaymentOrder);
paymentRouter.post("/verify", authenticate, paymentLimiter.middleware(), verifyPayment);

// ── Order Routes ─────────────────────────────────────
export const orderRouter = express.Router();
orderRouter.get("/bought", authenticate, getBuyerOrders);
orderRouter.get("/sold", authenticate, getSellerOrders);
