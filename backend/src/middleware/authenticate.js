/**
 * SOLID - SRP: This middleware only validates JWT tokens.
 * OOP: Encapsulation — token verification logic hidden from routes.
 */

import jwt from "jsonwebtoken";
import secretKey from "../configuration/jwtConfig.js";

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

export default authenticate;
