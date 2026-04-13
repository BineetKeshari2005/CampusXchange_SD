/**
 * SOLID - SRP: PaymentService only handles payment orchestration.
 * SOLID - DIP: Depends on PaymentContext (strategy abstraction), repositories.
 * DESIGN PATTERN: Strategy — delegates payment logic to RazorpayStrategy.
 * DESIGN PATTERN: Observer — emits order:paid event after successful payment.
 * OOP: Encapsulation — complex crypto verification is inside the strategy.
 */

import crypto from "crypto";
import { razorpay } from "../configuration/razorpay.js";
import { PaymentContext, RazorpayStrategy } from "../patterns/PaymentStrategy.js";
import OrderRepository from "../repositories/OrderRepository.js";
import ListingRepository from "../repositories/ListingRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import OrderEventEmitter from "../patterns/OrderEventEmitter.js";
import NotificationFactory from "../patterns/NotificationFactory.js";
import NotificationRepository from "../repositories/NotificationRepository.js";

const orderRepo = new OrderRepository();
const listingRepo = new ListingRepository();
const userRepo = new UserRepository();
const notifRepo = new NotificationRepository();
const eventEmitter = OrderEventEmitter.getInstance();

// Strategy Pattern: inject the Razorpay strategy
const paymentContext = new PaymentContext(new RazorpayStrategy(razorpay, crypto));

class PaymentService {
  async createPaymentOrder(listingId, buyerId) {
    const listing = await listingRepo.findByIdWithSeller(listingId);
    if (!listing) throw new Error("Listing not found");
    if (listing.status === "sold") throw new Error("Listing already sold");

    // Strategy Pattern: createOrder delegates to RazorpayStrategy
    const razorpayOrder = await paymentContext.createOrder(listing.price, {
      listingId: listing._id.toString(),
    });

    await orderRepo.create({
      buyerId,
      sellerId: listing.seller._id,
      listingId: listing._id,
      amount: listing.price,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return razorpayOrder;
  }

  async verifyAndComplete(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    // Strategy Pattern: verifyPayment delegates to RazorpayStrategy
    const isValid = await paymentContext.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (!isValid) throw new Error("Payment verification failed");

    const order = await orderRepo.markPaid(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!order) throw new Error("Order not found");

    const listing = await listingRepo.markAsSold(order.listingId);
    const seller = await userRepo.findById(order.sellerId);

    // Strategy Pattern: transferToSeller delegates to RazorpayStrategy
    if (seller?.razorpayAccountId) {
      await paymentContext.transferToSeller(
        seller.razorpayAccountId,
        order.amount,
        { orderId: order._id.toString() }
      );
    }

    // Observer Pattern: emit event so all listeners react
    eventEmitter.emitOrderPaid({
      order,
      listing,
      seller,
      buyerId: order.buyerId,
    });

    return { success: true };
  }

  async onboardSeller(sellerId) {
    const seller = await userRepo.findById(sellerId);
    if (!seller) throw new Error("Seller not found");
    if (!seller.phone || !seller.email || !seller.name) {
      throw new Error("Seller profile incomplete (name/email/phone required)");
    }

    if (!seller.razorpayAccountId) {
      const account = await razorpay.accounts.create({
        type: "route",
        legal_business_name: seller.name,
        business_type: "individual",
        contact_name: seller.name,
        contact_mobile: seller.phone.toString(),
        email: seller.email,
      });
      await userRepo.updateById(sellerId, { razorpayAccountId: account.id });
      seller.razorpayAccountId = account.id;
    }

    const link = await razorpay.accountLinks.create({
      account: seller.razorpayAccountId,
      purpose: "account_onboarding",
      refresh_url: `${process.env.FRONTEND_URL}/seller/payments`,
      return_url: `${process.env.FRONTEND_URL}/seller/payments`,
    });

    return { url: link.short_url };
  }
}

// Observer Pattern: register listeners ONCE at module load
eventEmitter.on("order:paid", async ({ order, listing, seller, buyerId }) => {
  try {
    // Notify buyer — Factory Pattern creates correct notification type
    const buyerNotif = NotificationFactory.create("order", {
      userId: buyerId,
      itemTitle: listing.title,
      amount: order.amount,
      link: `/buyer/bought`,
    });
    await notifRepo.create(buyerNotif.toPayload());

    // Notify seller — Factory Pattern
    const sellerNotif = NotificationFactory.create("listing", {
      userId: seller._id,
      itemTitle: listing.title,
      link: `/seller/listings`,
    });
    await notifRepo.create(sellerNotif.toPayload());
  } catch (err) {
    console.error("Notification error after order:paid:", err.message);
  }
});

export default PaymentService;
