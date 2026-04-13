/**
 * SOLID - SRP: NotificationService only manages notification retrieval/update.
 * SOLID - DIP: Depends on NotificationRepository abstraction.
 * DESIGN PATTERN: Factory — uses NotificationFactory to create notification objects.
 */

import NotificationRepository from "../repositories/NotificationRepository.js";
import NotificationFactory from "../patterns/NotificationFactory.js";

const notifRepo = new NotificationRepository();

class NotificationService {
  async createNotification(type, data) {
    // Factory Pattern: creates the right notification type
    const notification = NotificationFactory.create(type, data);
    return notifRepo.create(notification.toPayload());
  }

  async getNotifications(userId) {
    return notifRepo.findByUser(userId);
  }

  async markAsRead(notificationId, userId) {
    return notifRepo.markAsRead(notificationId, userId);
  }
}

export default NotificationService;
