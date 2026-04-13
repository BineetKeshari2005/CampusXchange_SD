/**
 * SYSTEM DESIGN: Rate Limiting
 * Prevents API abuse — limits requests per IP per time window.
 * SOLID - SRP: This middleware only handles rate limiting.
 * OOP: Encapsulation — rate limit state stored inside the Map, not exposed.
 */

class RateLimiter {
  #requests = new Map(); // IP → { count, resetTime }
  #windowMs;
  #max;

  constructor({ windowMs = 60000, max = 100 } = {}) {
    this.#windowMs = windowMs;
    this.#max = max;
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const record = this.#requests.get(ip);

      if (!record || now > record.resetTime) {
        this.#requests.set(ip, { count: 1, resetTime: now + this.#windowMs });
        return next();
      }

      if (record.count >= this.#max) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      }

      record.count++;
      next();
    };
  }
}

// Different limiters for different route groups
const generalLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 100 });
const authLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }); // stricter for auth
const paymentLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 20 });

export { generalLimiter, authLimiter, paymentLimiter };
