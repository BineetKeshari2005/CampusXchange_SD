/**
 * SOLID - SRP: Controllers ONLY handle HTTP request/response.
 * All business logic lives in the Service layer.
 * Controllers are thin — they delegate to services and return responses.
 *
 * OOP: Encapsulation — controllers don't know HOW things happen, only WHAT to call.
 */

import AuthService from "../services/AuthService.js";
import ListingService from "../services/ListingService.js";
import ProfileService from "../services/ProfileService.js";
import SavedService from "../services/SavedService.js";
import NotificationService from "../services/NotificationService.js";
import PaymentService from "../services/PaymentService.js";
import OrderService from "../services/OrderService.js";

const authService = new AuthService();
const listingService = new ListingService();
const profileService = new ProfileService();
const savedService = new SavedService();
const notifService = new NotificationService();
const paymentService = new PaymentService();
const orderService = new OrderService();

/* ===========================
   AUTH CONTROLLERS
=========================== */
export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: "User registered", ...result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (err) {
    next(err);
  }
};

/* ===========================
   LISTING CONTROLLERS
=========================== */
export const createListing = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const imageUrls = (req.files || []).map((f) => f.path);
    const data = { ...req.body, seller: req.user.id, images: imageUrls, status: "available" };

    const listing = await listingService.createListing(data);
    res.status(201).json({ message: "Listing created", data: listing });
  } catch (err) {
    next(err);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const data = await listingService.getListings(req.query);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const imageUrls = req.files?.length ? req.files.map((f) => f.path) : undefined;
    const updateData = { ...req.body, ...(imageUrls && { images: imageUrls }) };
    const updated = await listingService.updateListing(req.params.id, req.user.id, updateData);
    res.status(200).json({ message: "Listing updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id, req.user.id);
    res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const listings = await listingService.getMyListings(req.user.id);
    res.status(200).json({ total: listings.length, items: listings });
  } catch (err) {
    next(err);
  }
};

/* ===========================
   PROFILE CONTROLLERS
=========================== */
export const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.profilePhoto = req.file.path;
    const user = await profileService.updateProfile(req.user.id, updates);
    res.status(200).json({ message: "Profile updated", data: user });
  } catch (err) {
    next(err);
  }
};

export const getPublicUser = async (req, res, next) => {
  try {
    const user = await profileService.getPublicUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/* ===========================
   SAVED CONTROLLERS
=========================== */
export const toggleSaved = async (req, res, next) => {
  try {
    const result = await savedService.toggleSaved(req.user.id, req.params.listingId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getSaved = async (req, res, next) => {
  try {
    const data = await savedService.getSavedListings(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

/* ===========================
   NOTIFICATION CONTROLLERS
=========================== */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notifService.getNotifications(req.user.id);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ message: "Marked as read", data: notif });
  } catch (err) {
    next(err);
  }
};

/* ===========================
   PAYMENT CONTROLLERS
=========================== */
export const onboardSeller = async (req, res, next) => {
  try {
    const result = await paymentService.onboardSeller(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createPaymentOrder = async (req, res, next) => {
  try {
    const order = await paymentService.createPaymentOrder(req.params.listingId, req.user.id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyAndComplete(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/* ===========================
   ORDER CONTROLLERS
=========================== */
export const getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getBuyerOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getSellerOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
