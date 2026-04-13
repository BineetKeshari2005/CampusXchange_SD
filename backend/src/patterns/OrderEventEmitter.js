/**
 * DESIGN PATTERN: Observer Pattern
 * When an order is paid, multiple subsystems need to react:
 *   - Listing is marked sold
 *   - Seller is notified
 *   - Buyer is notified
 *   - Transfer to seller is triggered
 *
 * Using Node's built-in EventEmitter as the Observer mechanism.
 * Observers (listeners) are registered independently — decoupled from each other.
 *
 * SOLID - OCP: New reactions to an order event = new listener. No core change.
 * SOLID - SRP: Each listener handles ONE concern.
 */

import { EventEmitter } from "events";

class OrderEventEmitter extends EventEmitter {
  static #instance = null; // Singleton so all parts of app share same emitter

  static getInstance() {
    if (!OrderEventEmitter.#instance) {
      OrderEventEmitter.#instance = new OrderEventEmitter();
    }
    return OrderEventEmitter.#instance;
  }

  emitOrderPaid(orderData) {
    // Notify all observers that an order has been paid
    this.emit("order:paid", orderData);
  }

  emitListingCreated(listingData) {
    this.emit("listing:created", listingData);
  }

  emitMessageSent(messageData) {
    this.emit("chat:message", messageData);
  }
}

export default OrderEventEmitter;
