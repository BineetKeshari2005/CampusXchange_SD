/**
 * DESIGN PATTERN: Singleton
 * Ensures only ONE database connection is created throughout the app lifecycle.
 * SOLID - SRP: This class has one job — manage DB connection.
 */

import mongoose from "mongoose";

class Database {
  static #instance = null;
  #isConnected = false;

  constructor() {
    if (Database.#instance) {
      return Database.#instance;
    }
    Database.#instance = this;
  }

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  async connect(uri) {
    if (this.#isConnected) {
      console.log("DB already connected — reusing existing connection (Singleton)");
      return;
    }
    try {
      const conn = await mongoose.connect(uri);
      this.#isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`DB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }

  isConnected() {
    return this.#isConnected;
  }
}

export default Database;
