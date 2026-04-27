# CampusXchange

## Project Description

**CampusXchange** is a secure, real-time marketplace platform designed exclusively for university students. 

### The Problem
University students often find it difficult to trade academic resources (like books and lab equipment) or personal items safely. Public marketplaces like OLX often lack the trust and proximity needed for quick campus transactions.

### The Solution
CampusXchange provides a dedicated, trust-based environment where students can buy, sell, or exchange items within their own campus. It streamlines the process with integrated real-time chat and secure payment verification.

### Why it was built
To provide a hands-on demonstration of scalable system architecture, implementing professional patterns like the **Service Layer** and **Real-time Event Handling** in a real-world scenario.

---

## Features

- **Verified Student Access**: Secure JWT-based authentication ensuring only students can participate.
- **Real-Time Negotiation**: Instant messaging between buyers and sellers powered by Socket.io.
- **Secure Payments**: Integrated Razorpay gateway for safe transactions with automated verification.
- **Smart Listings**: Effortlessly create, manage, and browse product listings with image support.
- **Advanced Discovery**: Multi-parameter search, filtering, and pagination to find items quickly.
- **User Dashboards**: Personalized views for managing sales, purchases, and saved items.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.io (WebSockets)
- **Database**: MongoDB with Mongoose ODM
- **Media**: Cloudinary (Image Hosting & Optimization)
- **Payments**: Razorpay API

---

## System Architecture

The project follows a **Layered Architecture** to ensure separation of concerns and high scalability.

- **Modular Design**: Each core functionality (Auth, Payments, Chat) is treated as a separate module.
- **Service Layer Pattern**: 100% of business logic is encapsulated in the `/services` folder, keeping controllers "thin" and focused only on request handling.
- **Stateless Authentication**: Uses JWT for scalable, secure session management.

---

## Installation & Setup

Follow these steps to get the project running locally:

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary & Razorpay accounts

### 2. Clone the Project
```bash
git clone https://github.com/BineetKeshari2005/CampusXchange_SD.git
cd CampusXchange_SD
```

### 3. Backend Configuration
1. Navigate to `/backend` and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### 4. Frontend Configuration
1. Navigate to `/frontend` and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

---

## Usage

1. **Register/Login**: Create a student account using your university credentials.
2. **Browse Listings**: Use the home feed to find items or search for specific keywords.
3. **List an Item**: Click on "Sell" to upload photos and details of your product.
4. **Chat & Buy**: Message the seller directly to negotiate. Once agreed, proceed to secure checkout.
5. **Manage**: Use your dashboard to track your active listings and purchase history.

---

## Folder Structure

```text
CampusXchange_SD/
├── backend/
│   ├── src/
│   │   ├── services/    # Core Business Logic (Critical Layer)
│   │   ├── controllers/ # API Request Handlers
│   │   ├── models/      # Database Schemas
│   │   └── middleware/  # Auth & Validation Logic
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI Elements
│   │   ├── app/         # Next.js Pages & Routing
│   │   └── services/    # API Client Logic
└── diagrams/           # System Design Assets
```

---

## Future Improvements

- **AI-Powered Recommendations**: Personalizing the feed based on user browsing history.
- **Multi-Campus Support**: Expanding the platform to support multiple universities with location-based filtering.
- **Escrow Payment System**: Holding payments until the buyer confirms physical receipt of the item.
- **In-App Notifications**: Push notifications for chat messages and order updates.

---

<p align="center">Made for the Campus Community</p>
