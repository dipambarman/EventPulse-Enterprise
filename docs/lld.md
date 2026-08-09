# Low-Level Design (LLD)

This document details the code-level implementation and modular architecture of EventPulse.

## Backend Modular Structure

Each microservice in the `backend/services/` directory adheres to an MVC-like folder structure (minus the Views, as React handles the frontend).

```plaintext
service-name/
├── controllers/       # Contains business logic and orchestrates models
├── routes/            # Defines API endpoints and attaches middleware
├── middleware/        # Service-specific middleware (auth, RBAC)
├── services/          # External integrations (e.g., auditService, Razorpay SDK)
├── db/                # Database connection pooling
├── server.js          # Express app initialization
└── package.json       # Service-specific dependencies
```

## Security & Middleware Implementation

### 1. `authMiddleware.js`
Injected into protected routes, this middleware performs JWT validation.
1. Extracts the token from `req.cookies.token` (or Authorization header).
2. Uses `jsonwebtoken.verify()` against the `JWT_SECRET`.
3. Populates `req.user` with the decoded payload `{ id, role, email }`.
4. Yields 401 Unauthorized if the token is missing, expired, or invalid.

### 2. `roleMiddleware.js` (`adminOnly`)
Injected immediately after `authMiddleware.js`.
1. Asserts `req.user.role === 'admin'`.
2. Yields 403 Forbidden if false.
3. Protects routes like `DELETE /api/themes/:id` and `GET /api/bookings/admin/analytics`.

### 3. Request Validation
`express-validator` is used in routes like `paymentRoutes.js` and `notificationRoutes.js`.
- Rules are defined as an array: `[body('amount').isNumeric()]`.
- A generic `validateRequest` middleware parses `validationResult(req)` and returns a `400 Bad Request` mapping if validation fails.

## Key Modules

### `auditService.js`
A shared concept implemented across services. It exports `logAction(userId, action, entity, entityId, details)`.
- Uses UUID v4 for the log ID.
- Stores the event in the `audit_logs` table asynchronously without blocking the primary HTTP response.

### `bookingController.js` (Pagination Logic)
List endpoints (`getAllBookings`) implement pagination:
- Extracts `page` and `limit` from `req.query`, casting to integers.
- Calculates `offset = (page - 1) * limit`.
- Executes `LIMIT ? OFFSET ?` in the SQL query.
- Executes a parallel `COUNT(*)` query to return standard metadata (`{ total, page, limit, totalPages }`).

## Frontend State Management
The React application avoids Redux in favor of native React paradigms:
- **`AuthContext`**: Uses the Context API to distribute the authenticated user object, `login()`, and `logout()` functions globally.
- **`ToastContext`**: Provides a global utility for rendering transient success/error notifications.
