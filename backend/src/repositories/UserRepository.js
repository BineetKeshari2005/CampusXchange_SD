/**
 * OOP CONCEPT: Inheritance
 * UserRepository extends BaseRepository — inherits all generic DB methods
 * and adds User-specific queries.
 *
 * SOLID - SRP: Only responsible for User DB operations.
 * SOLID - LSP: Can replace BaseRepository wherever a repository is expected.
 */

import BaseRepository from "./BaseRepository.js";
import User from "../models/User.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User); // OOP: calls parent constructor with the User model
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }

  async findPublicProfile(userId) {
    return this.model.findById(userId).select("-password -razorpayAccountId");
  }

  async addToSavedListings(userId, listingId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { savedListings: listingId } },
      { new: true }
    );
  }

  async removeFromSavedListings(userId, listingId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { savedListings: listingId } },
      { new: true }
    );
  }

  async getSavedListings(userId) {
    return this.model
      .findById(userId)
      .populate("savedListings")
      .select("savedListings");
  }
}

export default UserRepository;
