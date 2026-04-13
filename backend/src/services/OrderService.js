/**
 * SOLID - SRP: OrderService only handles order retrieval logic.
 * SOLID - DIP: Depends on OrderRepository abstraction.
 */

import OrderRepository from "../repositories/OrderRepository.js";

const orderRepo = new OrderRepository();

class OrderService {
  async getBuyerOrders(buyerId) {
    return orderRepo.findBuyerOrders(buyerId);
  }

  async getSellerOrders(sellerId) {
    return orderRepo.findSellerOrders(sellerId);
  }
}

export default OrderService;
