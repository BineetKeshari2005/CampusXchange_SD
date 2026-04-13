/**
 * SOLID - SRP: ProfileService only handles profile update logic.
 * SOLID - DIP: Depends on UserRepository abstraction.
 * OOP: Encapsulation — getPublicProfile() called here before returning.
 */

import UserRepository from "../repositories/UserRepository.js";

const userRepo = new UserRepository();

class ProfileService {
  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    return user.getPublicProfile();
  }

  async updateProfile(userId, updates) {
    // Never allow password update through this service
    delete updates.password;
    delete updates.email;

    const user = await userRepo.updateById(userId, updates);
    if (!user) throw new Error("User not found");
    return user.getPublicProfile ? user.getPublicProfile() : user;
  }

  async getPublicUser(userId) {
    return userRepo.findPublicProfile(userId);
  }
}

export default ProfileService;
