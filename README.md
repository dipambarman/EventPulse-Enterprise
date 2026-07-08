<div align="center">
  <img src="frontend/public/vite.svg" alt="Eventify Logo" width="100"/>
  <h1>🎉 Event Management Platform</h1>
  <p>A modern, full-stack event booking and management system built with the PERN/MERN stack architecture (MySQL).</p>

  <p>
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#api-reference"><strong>API Reference</strong></a>
  </p>
</div>

<br/>

## 🚀 Overview

This **Event Management Platform** is designed to provide a seamless experience for browsing event themes, booking reservations, and managing secure payments. The architecture separates concerns beautifully with a high-performance RESTful API backend and a responsive, dynamic frontend.

## ✨ Features

- **🔐 User Authentication:** Secure login and registration with JWT authentication and password hashing.
- **📅 Event Bookings:** Robust booking engine for reserving event slots and themes.
- **💳 Payment Integration:** Secure and seamless checkout utilizing Razorpay.
- **🎨 Theme Management:** Browse and discover available event themes.
- **⚡ Real-time Interface:** Highly responsive single-page application built on Vite and React.
- **🔒 Security First:** Cross-Origin Resource Sharing (CORS), secure HTTP headers, and environment-driven configurations.

## 💻 Tech Stack

### Frontend
- **Framework:** React.js 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router v7

### Backend
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Payments:** Razorpay Integration

---

## 🛠️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/) running locally or in the cloud.
- A [Razorpay](https://razorpay.com/) account for payment processing.

### 1. Clone the repository

```bash
git clone https://github.com/dipambarman/project-event-management.git
cd project-event-management
```

### 2. Environment Variables

Create `.env` files in both the root directory and the `backend` directory based on your local configuration:

**Root / Backend `.env`**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management
SESSION_SECRET=your-secret-key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```
*The backend server will start running on http://localhost:5000*

### 4. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will be accessible at http://localhost:5173*

---

## 🏗️ Project Structure

```text
📦 project
 ┣ 📂 backend
 ┃ ┣ 📂 controllers     # Request handlers and business logic
 ┃ ┣ 📂 middleware      # Custom Express middlewares (Auth, etc.)
 ┃ ┣ 📂 routes          # API endpoint definitions
 ┃ ┣ 📜 server.js       # Express app entry point
 ┃ ┗ 📜 db.js           # Database connection configuration
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components    # Reusable React UI components
 ┃ ┃ ┣ 📂 pages         # Page-level components
 ┃ ┃ ┗ 📜 App.jsx       # Root React component
 ┃ ┣ 📜 vite.config.js
 ┃ ┗ 📜 index.html
 ┗ 📜 package.json
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
