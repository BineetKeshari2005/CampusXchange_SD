/**
 * DESIGN PATTERN: Factory Pattern
 * NotificationFactory creates the correct notification object based on type.
 * Caller doesn't need to know HOW each notification is built — just what type.
 *
 * OOP CONCEPT: Polymorphism
 * Each notification class has a toPayload() method — same interface, different behavior.
 *
 * SOLID - OCP: Adding a new notification type = new class + one case in factory.
 *              No existing code is modified.
 */

// --- Base Notification (Abstraction) ---
class BaseNotification {
  constructor({ userId, link = null }) {
    this.userId = userId;
    this.link = link;
  }

  // OOP: Polymorphism — each subclass overrides this
  toPayload() {
    throw new Error("toPayload() must be implemented by subclass");
  }
}

// --- Concrete Notification Types ---
class OrderNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.itemTitle = data.itemTitle;
    this.amount = data.amount;
  }

  toPayload() {
    return {
      user: this.userId,
      message: `Your order for "${this.itemTitle}" of ₹${this.amount} has been placed successfully.`,
      type: "order",
      link: this.link,
    };
  }
}

class PaymentNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.amount = data.amount;
    this.itemTitle = data.itemTitle;
  }

  toPayload() {
    return {
      user: this.userId,
      message: `Payment of ₹${this.amount} received for "${this.itemTitle}".`,
      type: "payment",
      link: this.link,
    };
  }
}

class ChatNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.senderName = data.senderName;
  }

  toPayload() {
    return {
      user: this.userId,
      message: `${this.senderName} sent you a message.`,
      type: "chat",
      link: this.link,
    };
  }
}

class ListingNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.itemTitle = data.itemTitle;
  }

  toPayload() {
    return {
      user: this.userId,
      message: `Your listing "${this.itemTitle}" has been sold!`,
      type: "listing",
      link: this.link,
    };
  }
}

// --- Factory ---
class NotificationFactory {
  static create(type, data) {
    switch (type) {
      case "order":
        return new OrderNotification(data);
      case "payment":
        return new PaymentNotification(data);
      case "chat":
        return new ChatNotification(data);
      case "listing":
        return new ListingNotification(data);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

export default NotificationFactory;
