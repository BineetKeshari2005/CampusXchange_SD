# 📌 CampusXchange: A Scalable Campus Marketplace

## 📖 Description
**CampusXchange** is a secure, real-time, full-stack marketplace platform designed exclusively for university students. It enables users to buy, sell, or exchange study materials, electronics, and other essentials within a trusted campus community.

---

## 👥 Team Members
*   **Himanshu Pandey**
*   **Bineet Kesari**
*   **Rudraksh Sharma**
*   **Alok Gangwar**
*   **Anuj Upadhyay**

---

## 🚀 Project Proposal

### 1. Problem Statement
Many university students struggle to find affordable study materials, second-hand electronics, and other essential academic resources. Students who want to sell or exchange their used items lack a secure and campus-specific platform to reach interested buyers. Broader marketplaces like OLX or Facebook Marketplace allow external users, reduce trust, and are not built for campus needs.

### 2. Proposed Solution
CampusXchange is a real-time, payment-enabled full-stack web platform designed exclusively for campus communities. The platform includes:
* Secure JWT-based authentication
* Real-time buyer–seller chat using Socket.IO
* Razorpay payment gateway integration
* Automated payment verification and order management
* Dedicated buyer and seller dashboards

### 3. Objectives
* Allow students to create, read, update, and delete (CRUD) item listings.
* Implement secure JWT authentication and protected APIs.
* Enable real-time communication between buyers and sellers.
* Provide secure Razorpay based online payments and verification.
* Support advanced search, sorting, filtering, and pagination for listings.

---

## 🏗️ System Architecture & Design
The project follows a **Layered Architecture** to ensure high maintainability:
1.  **Presentation Layer (Frontend):** Next.js handles the UI and client-side state.
2.  **Controller Layer (API Entry):** Manages HTTP requests and validates input.
3.  **Service Layer (Business Logic):** The "Brain" of the app where all marketplace rules live.
4.  **Repository Layer (Data Access):** Abstracts database operations.

---

## 🧠 System Design Concepts Implemented ⭐

| Concept | Definition | Application in Project |
| :--- | :--- | :--- |
| **Encapsulation** | Hiding internal state and requiring all interaction through well-defined interfaces. | All business logic is encapsulated within the **Services** folder, hidden from controllers. |
| **Abstraction** | Hiding complex implementation details. | The Repository layer abstracts MongoDB queries, so services don't need to know "how" data is fetched. |
| **Separation of Concerns** | Dividing a program into distinct sections, each addressing a separate concern. | Clear division between HTTP handling (Controller), Logic (Service), and Data (Repository). |
| **Modular Design** | Building a system as a collection of independent, interchangeable modules. | Features like Payments, Auth, and Chat are built as independent services. |
| **Reusability** | Designing code that can be used in multiple parts of the application or future projects. | The `AuthService` is designed to be reusable across different frontends (Web/Mobile). |
| **Scalability** | The ability of a system to handle increased load by adding resources. | The stateless nature of our JWT auth and modular services allows for horizontal scaling. |

---

## 📂 Services Folder Explanation ⭐ (CRITICAL)
The **Services Folder** is the core of our system design. In many basic applications, logic is scattered inside controllers. In **CampusXchange**, we moved 100% of the business logic into the Services folder.

*   **Business Logic Centralization:** Rules like "How to verify a payment signature" or "How to calculate profile completion" are handled here.
*   **Controller-Service Decoupling:** Controllers are "thin"—they only receive requests and delegate the work to the Service layer.
*   **Benefits:**
    *   **Maintainability:** Changing a business rule only requires editing one file in the Services folder.
    *   **Testability:** Services can be tested independently of the UI or HTTP server.
    *   **Readability:** It is immediately clear where the "rules" of the application are defined.

---

## ⚙️ Technologies Used
*   **Frontend:** Next.js, Tailwind CSS, Framer Motion.
*   **Backend:** Node.js, Express.js, Socket.io.
*   **Database:** MongoDB (Mongoose ORM).
*   **Payments:** Razorpay API.
*   **Auth:** JSON Web Tokens (JWT).

---

## ✅ Conclusion
**CampusXchange** demonstrates how professional software architecture principles like **SOLID** and **Layered Design** can be applied to a real-world project. The key takeaway was that investing time in a robust **Service Layer** makes the application significantly easier to debug, extend, and scale.

---
