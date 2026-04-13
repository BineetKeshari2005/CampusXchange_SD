/**
 * SOLID - SRP: AuthService only handles authentication logic.
 * SOLID - DIP: Depends on UserRepository abstraction, not on Mongoose directly.
 * OOP: Encapsulation — hashes password internally, caller doesn't need to know.
 */

import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils.js";

const userRepo = new UserRepository();

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    // Encapsulation: hashing is done here, not in the controller
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name, email, password: hashedPassword });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user: user.getPublicProfile(), accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user: user.getPublicProfile(), accessToken, refreshToken };
  }
}

export default AuthService;
