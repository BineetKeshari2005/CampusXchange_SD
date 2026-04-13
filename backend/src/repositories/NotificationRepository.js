/**
 * OOP: Inheritance — extends BaseRepository
 * SOLID - SRP: Only handles Notification DB operations
 */

import BaseRepository from "./BaseRepository.js";
import Notification from "../models/Notification.js";

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findByUser(userId) {
    return this.model.find({ user: userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId, userId) {
    return this.model.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }
}

export default NotificationRepository;
