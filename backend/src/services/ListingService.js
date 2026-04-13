/**
 * SOLID - SRP: ListingService only handles listing business logic.
 * SOLID - DIP: Depends on ListingRepository abstraction, not Mongoose directly.
 * OOP: Uses OrderEventEmitter (Observer) to broadcast listing events.
 */

import ListingRepository from "../repositories/ListingRepository.js";
import OrderEventEmitter from "../patterns/OrderEventEmitter.js";

const listingRepo = new ListingRepository();
const eventEmitter = OrderEventEmitter.getInstance();

class ListingService {
  async createListing(data) {
    const listing = await listingRepo.create(data);
    // Observer: notify any listeners that a new listing was created
    eventEmitter.emitListingCreated(listing);
    return listing;
  }

  async getListings(query) {
    return listingRepo.findWithFilters(query);
  }

  async getListingById(id) {
    const listing = await listingRepo.findByIdWithSeller(id);
    if (!listing) throw new Error("Listing not found");
    return listing;
  }

  async updateListing(id, userId, data) {
    const listing = await listingRepo.updateOne(
      { _id: id, seller: userId },
      data
    );
    if (!listing) throw new Error("Listing not found or you are not the owner");
    return listing;
  }

  async deleteListing(id, userId) {
    const listing = await listingRepo.deleteOne({ _id: id, seller: userId });
    if (!listing) throw new Error("Listing not found or you are not the owner");
    return listing;
  }

  async getMyListings(userId) {
    return listingRepo.findBySeller(userId);
  }
}

export default ListingService;
