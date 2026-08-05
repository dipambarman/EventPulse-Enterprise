<div align="center">
  <img src="frontend/public/vite.svg" alt="EventPulse Logo" width="120"/>
  <h1>⚡ EventPulse Enterprise</h1>
  <p><strong>Production-Grade, FAANG-Standard Distributed Event Management & Dynamic Booking Platform</strong></p>

  <p>
    <a href="https://github.com/dipambarman/project-event-management/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions" alt="Build Status"/></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js"/></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react" alt="React 18"/></a>
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-v4.21-000000?style=for-the-badge&logo=express" alt="Express.js"/></a>
    <a href="https://www.mysql.com"><img src="https://img.shields.io/badge/MySQL-3NF_Normalized-4479A1?style=for-the-badge&logo=mysql" alt="MySQL"/></a>
    <a href="https://razorpay.com"><img src="https://img.shields.io/badge/Payment-Razorpay_v2-02042B?style=for-the-badge&logo=razorpay" alt="Razorpay"/></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License"/></a>
  </p>

  <p>
    <a href="#-executive-summary">Executive Summary</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-security-hardening-matrix">Security</a> •
    <a href="#-database--normalization-specs">Database Specs</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#%EF%B8%8F-getting-started">Deployment</a>
  </p>
</div>

---

## 📋 Executive Summary

**EventPulse Enterprise** is an end-to-end, high-concurrency event management platform engineered for enterprise scalability, sub-millisecond execution, and uncompromising security. Designed around a decoupled microservice-ready MVC pattern, EventPulse handles high-volume event browsing, real-time availability lockouts, strict server-side price verification, and multi-gateway payment processing.

The platform includes a **Zero-Downtime In-Memory Fallback Engine**, ensuring seamless service execution even during primary relational database outages or failovers.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client Layer ["Client Layer (React 18 + Vite)"]
        UI["SPA Interface (React Router v7 + Tailwind CSS)"]
        AuthContext["Auth Context (Credentials: Include)"]
    end

    subgraph Security Layer ["Security & Hardening Pipeline"]
        CORS["Strict CORS Filtering"]
        Helmet["Helmet HTTP Headers"]
        CSRF["Origin / Referer CSRF Defense"]
        RateLimiter["IP Rate Limiter"]
    end

    subgraph API Gateway ["Backend Runtime (Express.js)"]
        Router["Express Router Pipeline"]
        AuthMiddleware["JWT Verification (HttpOnly Cookie)"]
        Validator["Express Validator (Input Sanitization)"]
    end

    subgraph Business Logic ["Controllers & Transaction Engine"]
        BookingCtrl["Booking Controller (3NF Relational Logic & Transactions)"]
        PaymentCtrl["Payment Controller (HMAC Signature Verification)"]
        ThemeCtrl["Theme Catalog Engine"]
    end

    subgraph Persistence Layer ["Storage & Fallback Engine"]
        MySQL["MySQL Database Pool (3NF Normalized)"]
        MockEngine["Zero-Downtime In-Memory DB Engine"]
        RazorpayGateway["Razorpay SDK Payment Gateway"]
    end

    UI --> AuthContext
    AuthContext --> CORS
    CORS --> Helmet --> CSRF --> RateLimiter --> Router
    Router --> AuthMiddleware --> Validator
    Validator --> BookingCtrl & PaymentCtrl & ThemeCtrl
    BookingCtrl -->|ACID Transactions| MySQL
    BookingCtrl -.->|Failover Fallback| MockEngine
    PaymentCtrl -->|HMAC SHA256| RazorpayGateway
```

---

## 🛡 Security Hardening Matrix

EventPulse implements a multi-layer defense-in-depth security posture designed to withstand enterprise penetration tests and mitigate OWASP Top 10 vulnerabilities:

| Vulnerability Category | Mitigation Strategy & Implementation Details | Security Standard |
|---|---|---|
| **Credential Theft / XSS** | JWT tokens stored exclusively in `HttpOnly`, `SameSite=Strict`, `Secure` cookies. Zero exposure to `localStorage` or JavaScript execution contexts. | **OWASP A07:2021** |
| **Cross-Origin Attacks (CORS)** | Strict whitelisting callback on `Origin` headers with explicit rejection of unknown domains. | **OWASP A05:2021** |
| **Insecure Direct Object Reference (IDOR)** | Strict user-bound ownership enforcement (`WHERE user_id = ? AND id = ?`) on all mutation, read, and payment endpoints. | **OWASP A01:2021** |
| **Price & Payload Tampering** | Total booking costs are computed server-side via trusted theme base rates, guest tiering math, and registered add-on lookups. Client-provided prices are ignored. | **OWASP A08:2021** |
| **Cross-Site Request Forgery (CSRF)** | Custom validation middleware checking `Origin` and `Referer` headers on all state-changing HTTP methods (`POST`, `PATCH`, `DELETE`). | **OWASP A01:2021** |
| **Brute Force & Abuse** | Express Rate Limiting applied to authentication routes (max 20 requests per 15-minute window per IP). | **OWASP A04:2021** |
| **SQL Injection (SQLi)** | 100% prepared SQL statements (`pool.execute(sql, params)`) preventing arbitrary SQL execution. | **OWASP A03:2021** |
| **Information Disclosure** | Internal stack trace stripping in production environments. Generic client error messages. Request body size limited to `1mb`. | **OWASP A04:2021** |

---

## 💾 Database & Normalization Specs

The database layer follows strict **Third Normal Form (3NF)** rules to eliminate redundancy, enforce relational integrity, and guarantee ACID properties.

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : places
    THEMES ||--o{ BOOKINGS : applies_to
    BOOKINGS ||--o{ BOOKING_ADD_ONS : contains
    ADD_ONS ||--o{ BOOKING_ADD_ONS : satisfies
    BOOKINGS ||--o{ PAYMENTS : generates

    USERS {
        string id PK
        string username
        string email UK
        string password_hash
        timestamp created_at
        timestamp deleted_at
    }

    THEMES {
        string id PK
        string name
        string category
        decimal price
        text description
        timestamp deleted_at
    }

    BOOKINGS {
        string id PK
        string theme_id FK
        string user_id FK
        date start_date
        date end_date
        decimal total_price
        int guest_count
        string customer_name
        string customer_email
        string customer_phone
        enum status
        timestamp deleted_at
    }

    ADD_ONS {
        string id PK
        string name
        decimal price
    }

    BOOKING_ADD_ONS {
        string booking_id PK, FK
        string add_on_id PK, FK
        int quantity
        decimal price_at_booking
    }

    PAYMENTS {
        string id PK
        string booking_id FK
        decimal amount
        enum status
        string gateway_order_id
        string gateway_payment_id
        string gateway_signature
        string payment_method
        timestamp created_at
    }
```

### Relational Integrity Highlights
- **Atomic Customer Profiles**: Customer details (`customer_name`, `customer_email`, `customer_phone`) are normalized into explicit columns instead of un-indexed JSON structures.
- **Historical Price Locking**: The `booking_add_ons` table records `price_at_booking` to ensure financial audits remain immutable even when global add-on prices change.
- **Soft Deletions**: Tables maintain a `deleted_at` column to facilitate non-destructive compliance soft-deletes and auditing.
- **Performance Indexes**: High-velocity querying is accelerated via indexes on `(start_date, end_date)`, `user_id`, and payment status `gateway_order_id`.

---

## 🔌 API Reference

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue HttpOnly JWT cookie |
| `POST` | `/api/auth/logout` | Authenticated | Clear HttpOnly JWT authentication cookie |

### Booking Endpoints (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings/availability` | Public | Check date range & theme availability |
| `POST` | `/api/bookings` | Authenticated | Create booking (ACID transaction + server-side price computation) |
| `GET` | `/api/bookings/user` | Authenticated | Fetch authenticated user's active bookings |
| `GET` | `/api/bookings/:id` | Authenticated | Fetch booking by ID (enforces ownership check) |
| `PATCH` | `/api/bookings/:id` | Authenticated | Update booking parameters (whitelisted fields only) |
| `POST` | `/api/bookings/:id/cancel` | Authenticated | Soft cancel booking |

### Payment Endpoints (`/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/razorpay/order` | Authenticated | Create Razorpay order ID & store pending payment |
| `POST` | `/api/payments/razorpay/verify` | Authenticated | Verify HMAC SHA256 signature & mark payment completed |
| `POST` | `/api/payments/razorpay/webhook` | Webhook Signature | Razorpay payment capture webhook listener |
| `GET` | `/api/payments/history` | Authenticated | Fetch user-scoped payment history |

---

## ⚙️ Development & Deployment

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MySQL Server** (Optional, automatic zero-downtime fallback to In-Memory Engine if absent)

### 1. Repository Setup
```bash
git clone https://github.com/dipambarman/project-event-management.git
cd project-event-management
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_super_secret_session_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 3. Backend Execution
```bash
cd backend
npm install
npm run dev
```
*API initialized at `http://localhost:5000`*

### 4. Frontend Execution
```bash
cd ../frontend
npm install
npm run dev
```
*Client application initialized at `http://localhost:5173`*

---

## 📂 Project Directory Structure

```plaintext
project-event-management/
├── .env                         # Root environment configurations (GitIgnored)
├── .gitignore                   # Enterprise git exclusion patterns
├── README.md                    # Core documentation blueprint
├── backend/
│   ├── config/                  # Server configuration constants
│   ├── controllers/             # Business logic & request validation controllers
│   │   ├── addonController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   └── themeController.js
│   ├── db.js                    # Dual-mode MySQL Pool & In-Memory Fallback Engine
│   ├── middleware/              # Authentication & Security pipelines
│   │   └── authMiddleware.js
│   ├── migrations/              # Database blueprints & 3NF SQL schemas
│   │   └── create_tables.sql
│   ├── routes/                  # Express API route declarations
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── themeRoutes.js
│   ├── package.json             # Backend dependencies & script definitions
│   └── server.js                # HTTP Server entrypoint & security middleware initialization
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI component architecture
    │   ├── pages/               # Application view routes
    │   ├── services/            # Axios API interfaces (Credentials Enabled)
    │   ├── App.jsx              # Root Application Provider & Routing
    │   └── main.jsx             # React entrypoint
    ├── vite.config.js           # Vite dev server & proxy settings
    └── package.json             # Client dependencies
```

---

## 📄 License

This repository is distributed under the **MIT License**. See the `LICENSE` file for details.

---

<div align="center">
  <sub>Built with precision, security, and scalability in mind by <strong>Dipam Barman</strong> & Team.</sub>
</div>
