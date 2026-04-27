## Live Frontend Link

🔗 [campus-x-change-gamma.vercel.app](https://campus-x-change-gamma.vercel.app/auth/login)

---

# CampusXchange — A Campus Marketplace for Students

## Project Proposal

### 1. Project Title

**CampusXchange** – A Campus Marketplace for Students

---

### 2. Problem Statement

Many university students struggle to find affordable study materials, second-hand electronics, and other essential academic resources. Students who want to sell or exchange their used items lack a secure and campus-specific platform to reach interested buyers. Broader marketplaces like OLX or Facebook Marketplace allow external users, reduce trust, and are not built for campus needs. There is also no safe way for students to chat and complete payments inside a campus-only system.

---

### 3. Proposed Solution

CampusXchange is a real-time, payment-enabled full-stack web platform designed exclusively for campus communities. Students can buy, sell, or exchange used books, electronics, and notes. The platform includes:

* Secure JWT-based authentication
* Real-time buyer–seller chat using Socket.IO
* Razorpay payment gateway integration
* Automated payment verification and order management
* Dedicated buyer and seller dashboards
* Campus-specific listings with search, filter, and sorting
* Pagination for performance and smoother browsing
* Wishlist and saved listings functionality

---

### 4. Objectives

* Allow students to create, read, update, and delete (CRUD) item listings.
* Implement secure JWT authentication and protected APIs.
* Enable real-time communication between buyers and sellers.
* Provide secure Razorpay based online payments and verification.
* Provide advanced search, sorting, filtering, and pagination for item listings.
* Support dynamic data fetching across pages using APIs.
* Include wishlist, bought items, and sold items dashboards.

---

### 5. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payments** | Razorpay |
| **Patterns** | Singleton, Observer, Strategy, Factory |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

### 6. System Design & Architecture

CampusXchange is built with a focus on **Scalability, Maintainability, and Clean Code** principles.

#### A. Architecture Overview
The backend follows a **Layered Architecture** (Onion Architecture influences):
`Request → Route → Controller → Service → Repository → Model → Database`

- **Controllers**: Handle HTTP-specific logic (req/res).
- **Services**: Contain the core business logic (Auth, Payments, Listings).
- **Repositories**: Handle all Database interactions (Mongoose). This decouples business logic from the database implementation.

#### B. SOLID Principles Applied
- **Single Responsibility (SRP)**: Each class/function does one thing. Services handle logic, Repositories handle data, Controllers handle routing.
- **Open/Closed (OCP)**: New listing types or payment strategies can be added without modifying existing core logic.
- **Liskov Substitution (LSP)**: All repositories extend a `BaseRepository`, ensuring consistent behavior.
- **Interface Segregation (ISP)**: API routes are modularized (auth, listings, payments) to prevent "fat" routers.
- **Dependency Inversion (DIP)**: High-level services depend on repository abstractions, not concrete database calls.

#### C. Design Patterns Used
- **Singleton**: The `Database` class uses the Singleton pattern to ensure only one connection to MongoDB exists throughout the application lifecycle.
- **Observer**: `OrderEventEmitter` broadcasts events (like `listingCreated`) to various services (like Notifications) without tight coupling.
- **Strategy**: `PaymentContext` uses a Strategy pattern to handle different payment providers (currently implemented with `RazorpayStrategy`).
- **Factory**: `NotificationFactory` is used to create different types of notification objects dynamically based on the event type.

---

### 7. Roles & Responsibilities

#### Student User
* Register and manage profile
* Create, update, and delete listings
* Chat in real time with buyers and sellers
* Make secure online payments
* View bought and sold dashboards
* Save favorite products (wishlist)

---

### 8. Expected Outcomes
* A fully functional real-time campus marketplace.
* Secure payment flow with Razorpay verification.
* Optimized browsing with pagination, filtering, and sorting.
* Live buyer–seller communication.
* Campus-exclusive trusted environment.
* Automated order and dashboard management.

---

### 9. Tools & Platforms
VS Code, GitHub, Postman, MongoDB Atlas, Vercel, Render, Figma (UI/UX Design)