/**
 * OOP CONCEPT: Inheritance
 * OrderRepository extends BaseRepository for order-specific DB operations.
 * SOLID - SRP: Only responsible for Order collection operations.
 */

import BaseRepository from "./BaseRepository.js";
import Order from "../models/Order.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByRazorpayOrderId(razorpayOrderId) {
    return this.model.findOne({ razorpayOrderId });
  }

  async findBuyerOrders(buyerId) {
    return this.model
      .find({ buyerId, status: "paid" })
      .populate("listingId")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });
  }

  async findSellerOrders(sellerId) {
    return this.model
      .find({ sellerId, status: "paid" })
      .populate("listingId")
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 });
  }

  async markPaid(razorpayOrderId, paymentId, signature) {
    return this.model.findOneAndUpdate(
      { razorpayOrderId },
      { status: "paid", razorpayPaymentId: paymentId, razorpaySignature: signature },
      { new: true }
    );
  }
}

export default OrderRepository;
