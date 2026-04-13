import jwt from "jsonwebtoken";
import secretKey from "../configuration/jwtConfig.js";

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "1d" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: "7d" });
};

export default generateAccessToken;
