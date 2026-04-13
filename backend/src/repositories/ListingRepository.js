/**
 * OOP CONCEPT: Inheritance + Encapsulation
 * ListingRepository extends BaseRepository and adds search/filter/pagination logic.
 *
 * SOLID - SRP: Only handles Listing DB operations.
 * SOLID - OCP: New query methods can be added here without touching BaseRepository.
 */

import BaseRepository from "./BaseRepository.js";
import Listing from "../models/Listing.js";

class ListingRepository extends BaseRepository {
  constructor() {
    super(Listing);
  }

  async findWithFilters({ search, category, minPrice, maxPrice, condition, sort, page = 1, limit = 20 }) {
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { status: "available" };

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category.toLowerCase();
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (condition) filter.condition = condition.toLowerCase();

    const sortOptions =
      sort === "price_asc" ? { price: 1 }
      : sort === "price_desc" ? { price: -1 }
      : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("seller", "name email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySeller(sellerId) {
    return this.model.find({ seller: sellerId }).sort({ createdAt: -1 });
  }

  async markAsSold(listingId) {
    return this.updateById(listingId, { status: "sold" });
  }

  async findByIdWithSeller(id) {
    return this.model.findById(id).populate("seller", "name email hostel phone");
  }
}

export default ListingRepository;
