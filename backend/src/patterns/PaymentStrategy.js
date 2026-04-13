/**
 * DESIGN PATTERN: Strategy Pattern
 * Defines a family of payment algorithms (Razorpay, Wallet, COD).
 * Allows switching payment method without changing the caller code.
 *
 * OOP CONCEPT: Polymorphism
 * All strategies share the same interface but implement it differently.
 *
 * SOLID - OCP: Add new payment method = new strategy class. Nothing else changes.
 * SOLID - DIP: PaymentContext depends on the BasePaymentStrategy abstraction.
 */

// Abstract base — defines the interface all strategies must follow
class BasePaymentStrategy {
  async createOrder(amount, metadata) {
    throw new Error("createOrder() must be implemented");
  }

  async verifyPayment(paymentData) {
    throw new Error("verifyPayment() must be implemented");
  }

  async transferToSeller(sellerId, amount, metadata) {
    throw new Error("transferToSeller() must be implemented");
  }
}

// --- Concrete Strategy: Razorpay ---
class RazorpayStrategy extends BasePaymentStrategy {
  #razorpay;
  #crypto;

  constructor(razorpayInstance, cryptoModule) {
    super();
    this.#razorpay = razorpayInstance;
    this.#crypto = cryptoModule;
  }

  async createOrder(amount, metadata) {
    return this.#razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: metadata.listingId,
    });
  }

  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = this.#crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === razorpay_signature;
  }

  async transferToSeller(sellerRazorpayAccountId, amount, metadata) {
    return this.#razorpay.transfers.create({
      account: sellerRazorpayAccountId,
      amount: amount * 100 - 100, // deduct platform fee
      currency: "INR",
      notes: { orderId: metadata.orderId },
    });
  }
}

// --- Concrete Strategy: COD (Cash on Delivery) — future use ---
class CODStrategy extends BasePaymentStrategy {
  async createOrder(amount, metadata) {
    return { id: `COD-${Date.now()}`, amount, status: "pending_delivery" };
  }

  async verifyPayment() {
    return true; // COD is always "verified" at creation
  }

  async transferToSeller() {
    return null; // No digital transfer for COD
  }
}

// --- Context: uses a strategy ---
class PaymentContext {
  #strategy;

  constructor(strategy) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  async createOrder(amount, metadata) {
    return this.#strategy.createOrder(amount, metadata);
  }

  async verifyPayment(paymentData) {
    return this.#strategy.verifyPayment(paymentData);
  }

  async transferToSeller(sellerId, amount, metadata) {
    return this.#strategy.transferToSeller(sellerId, amount, metadata);
  }
}

export { BasePaymentStrategy, RazorpayStrategy, CODStrategy, PaymentContext };
