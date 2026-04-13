/**
 * OOP CONCEPT: Encapsulation
 * User model encapsulates data + behavior (methods on the schema).
 * getPublicProfile() hides sensitive fields — private data stays private.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    hostel: { type: String, default: "" },
    room: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    razorpayAccountId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["not_enabled", "pending_verification", "active"],
      default: "not_enabled",
    },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true }
);

// OOP: Encapsulation — instance method hides sensitive fields
userSchema.methods.getPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.razorpayAccountId;
  return obj;
};

// OOP: Encapsulation — checks if listing is saved
userSchema.methods.hasSavedListing = function (listingId) {
  return this.savedListings.some((id) => id.toString() === listingId.toString());
};

export default mongoose.models.User || mongoose.model("User", userSchema);
