/**
 * SOLID - SRP: SavedService only handles wishlist/saved listings logic.
 * SOLID - DIP: Depends on UserRepository abstraction.
 * OOP: Uses encapsulated method hasSavedListing() from User model.
 */

import UserRepository from "../repositories/UserRepository.js";

const userRepo = new UserRepository();

class SavedService {
  async toggleSaved(userId, listingId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    // OOP: Encapsulation — hasSavedListing is a method on the User model
    if (user.hasSavedListing(listingId)) {
      await userRepo.removeFromSavedListings(userId, listingId);
      return { saved: false, message: "Removed from saved" };
    } else {
      await userRepo.addToSavedListings(userId, listingId);
      return { saved: true, message: "Added to saved" };
    }
  }

  async getSavedListings(userId) {
    return userRepo.getSavedListings(userId);
  }
}

export default SavedService;
