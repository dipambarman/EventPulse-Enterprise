# API Contracts

This document outlines the interfaces for the microservices in the EventPulse ecosystem. All requests pass through the API Gateway at `http://localhost:5000/api/*`.

## 1. Auth Service (`/api/auth/*`)

### `POST /login`
Authenticates a user and sets an HttpOnly JWT cookie.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "usr-uuid",
      "username": "johndoe",
      "email": "user@example.com",
      "role": "client"
    }
  }
  ```

## 2. Booking Service (`/api/bookings/*`)

### `GET /availability`
Checks if a theme can be booked for specific dates.
- **Query Params:** `?themeId=t1&startDate=2026-10-10&endDate=2026-10-11`
- **Response (200 OK):**
  ```json
  {
    "available": true
  }
  ```

### `POST /`
Creates a new booking and triggers async notification.
- **Headers:** Requires valid Cookie token.
- **Request Body:**
  ```json
  {
    "themeId": "thm-uuid",
    "date": "2026-10-10",
    "endDate": "2026-10-10",
    "guestCount": 50,
    "totalPrice": 15000,
    "customerInfo": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "9876543210"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Booking created successfully",
    "bookingId": "EVT-834"
  }
  ```

## 3. Theme Service (`/api/themes/*`)

### `GET /`
Retrieves the catalog of available themes.
- **Response (200 OK):**
  ```json
  [
    {
      "id": "t1",
      "name": "Luxury Wedding",
      "price": 50000,
      "category": "Wedding",
      "description": "Premium setup with floral decor."
    }
  ]
  ```

## 4. Payment Service (`/api/payments/*`)

### `POST /razorpay/order`
Initializes a new order ID from Razorpay.
- **Request Body:**
  ```json
  { "amount": 15000 }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "order_Fk...xyz",
    "amount": 15000,
    "currency": "INR"
  }
  ```

### `POST /razorpay/verify`
Verifies the HMAC signature post-payment.
- **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "a8c9b...",
    "bookingId": "EVT-834"
  }
  ```
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Payment verified" }
  ```

## 5. Notification Service (`/api/notifications/*`)

### `POST /email`
Dispatches an asynchronous email. (Internal use primarily).
- **Request Body:**
  ```json
  {
    "type": "booking_confirmation",
    "recipientEmail": "jane@example.com",
    "customerName": "Jane Doe",
    "bookingId": "EVT-834",
    "totalPrice": 15000
  }
  ```
- **Response (200 OK):**
  ```json
  { "message": "Email sent" }
  ```
