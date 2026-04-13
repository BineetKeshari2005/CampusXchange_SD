/**
 * Application Entry Point
 *
 * DESIGN PATTERN: Singleton — Database.getInstance() ensures one DB connection.
 * DESIGN PATTERN: Observer — OrderEventEmitter listeners are registered in PaymentService.
 * DESIGN PATTERN: Factory — NotificationFactory used inside services.
 * DESIGN PATTERN: Strategy — PaymentContext uses RazorpayStrategy.
 *
 * SOLID - SRP: This file only bootstraps the app. No business logic here.
 * SOLID - DIP: App depends on abstractions (services, repos), not concrete DB calls.
 *
 * SYSTEM DESIGN: Layered Architecture
 *   Request → Route → Controller → Service → Repository → Model → MongoDB
 */

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

import Database from "./configuration/Database.js";          // Singleton
import secretKey from "./configuration/jwtConfig.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

import {
  authRouter,
  listingRouter,
  profileRouter,
  savedRouter,
  notificationRouter,
  paymentRouter,
  orderRouter,
} from "./routes/index.js";
import chatRoutes from "./routes/chat.js";

import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";

dotenv.config();

// ── SINGLETON: One DB connection for entire app ──────────────
const db = Database.getInstance();
db.connect(process.env.MONGO_URI);

const app = express();

app.use("/api/payments/webhook", bodyParser.raw({ type: "application/json" }));
app.use(express.json());
app.use(cors());

// ── SOCKET.IO SETUP ──────────────────────────────────────────
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);

const onlineUsers = new Map();

// Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("NO_TOKEN"));
  try {
    const user = jwt.verify(token, secretKey);
    socket.userId = user.id;
    next();
  } catch {
    next(new Error("INVALID_TOKEN"));
  }
});

// Socket events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.userId);
  onlineUsers.set(socket.userId, socket.id);

  socket.on("join_room", async (conversationId) => {
    const convo = await Conversation.findById(conversationId);
    if (!convo) return;
    if (![convo.buyerId?.toString(), convo.sellerId?.toString()].includes(socket.userId)) return;

    socket.join(conversationId);

    if (socket.userId === convo.buyerId?.toString()) convo.unread.buyer = 0;
    if (socket.userId === convo.sellerId?.toString()) convo.unread.seller = 0;
    await convo.save();
  });

  socket.on("send_message", async ({ conversationId, text }) => {
    const convo = await Conversation.findById(conversationId);
    if (!convo || convo.closed) return;

    const msg = await Message.create({ conversationId, senderId: socket.userId, text });

    convo.lastMessage = text;
    convo.lastMessageAt = new Date();
    if (socket.userId === convo.buyerId?.toString()) convo.unread.seller++;
    if (socket.userId === convo.sellerId?.toString()) convo.unread.buyer++;
    await convo.save();

    io.to(conversationId).emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    console.log("Socket disconnected:", socket.userId);
  });
});

// ── ROUTES ───────────────────────────────────────────────────
// System Design: Layered — all routes go through their own router
app.use("/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/profile", profileRouter);
app.use("/api/saved", savedRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("CampusXchange API 🚀 — Refactored with OOP, SOLID & Design Patterns"));

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────
// SOLID SRP: All error handling flows here, not scattered in routes
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
