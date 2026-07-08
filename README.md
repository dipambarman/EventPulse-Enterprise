<div align="center">
  <img src="frontend/public/vite.svg" alt="Eventify Logo" width="100"/>
  <h1>🎉 Event Management Platform</h1>
  <p>A high-performance, decoupled full-stack event discovery and booking engine built with React, Node.js, and MySQL.</p>

  <p>
    <a href="#-core-features"><strong>Features</strong></a> •
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#-concurrency--data-integrity"><strong>Concurrency & Integrity</strong></a> •
    <a href="#%EF%B8%8F-getting-started"><strong>Getting Started</strong></a>
  </p>
</div>

---

## 🚀 Overview
This **Event Management Platform** is a full-stack single-page application (SPA) featuring an isolated RESTful API backend and a dynamic frontend. The application is built around a secure MVC architecture, focused heavily on relational database integrity, strict request scheduling, and seamless web payments.

## ✨ Core Features

*   **🔐 Secure Session Controls:** User authentication and stateless session management leveraging JSON Web Tokens (JWT) and `bcrypt` password hashing.
*   **📅 Capacity-Enforced Bookings:** Robust ticket allocation engine featuring transaction-safe checks to prevent event over-allocation.
*   **💳 Payment Gateway Integration:** Complete end-to-end multi-step checkout workflow utilizing the Razorpay SDK with secure server-side signature verification.
*   **🎨 Dynamic Theme Engine:** High-performance data fetching interface for real-time event discovery, category sorting, and catalog browsing.
*   **🔒 Hardened Middleware Pipeline:** Production-configured security layer utilizing CORS controls, parameterized query handling to eliminate SQL injection, and secure environment isolation.

---

## ⚡ Concurrency & Data Integrity
To prevent race conditions during peak registration windows, the booking backend enforces transactional guardrails:
*   **Double-Booking Prevention:** Implements conditional database validation to ensure an individual user profile cannot register concurrent slots for identical event times.
*   **Capacity Enforcement:** Validates remaining inventory limits using atomic SQL queries prior to generating checkout signatures, ensuring allocations strictly respect venue bounds under concurrent traffic loads.

---

## 💻 Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Client** | React 18 • Vite • Tailwind CSS (v4) • React Router v7 |
| **Backend Runtime** | Node.js • Express.js (REST API Architecture) |
| **Database Layer** | MySQL (Normalized relational architecture) |
| **Security & Utilities** | JSON Web Tokens (JWT) • Bcryptjs • Razorpay SDK |

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   Local or cloud instance of MySQL Server

### 1. Clone & Environment Configurations
```bash
git clone https://github.com/dipambarman/project-event-management.git
cd project-event-management
```
Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_management
JWT_SECRET=your_jwt_signing_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 2. Execution Pipelines

**Backend Services:**
```bash
cd backend
npm install
npm run dev
```
*Backend API initializes instantly at http://localhost:5000*

**Frontend Services:**
```bash
# Execute in an isolated terminal instance
cd frontend
npm install
npm run dev
```
*Single Page Application launches instantly at http://localhost:5173*

## 📂 Structural Layout
```plaintext
📦 project-event-management
 ┣ 📂 backend
 ┃ ┣ 📂 controllers     # Core request handlers and business validation
 ┃ ┣ 📂 middleware      # JWT authenticators and security handlers
 ┃ ┣ 📂 routes          # Decoupled RESTful endpoint routing definitions
 ┃ ┣ 📜 db.js           # MySQL relational client connection pool
 ┃ ┗ 📜 server.js       # App configuration entry node
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components    # Modular and atomic UI presentation components
 ┃ ┃ ┣ 📂 pages         # Page-level route views
 ┃ ┃ ┗ 📜 App.jsx       # Root wrapper and router layout provider
```

## 📄 License
Distributed under the open-source MIT License.
