# High-Level Design (HLD)

EventPulse is architected as a decoupled, microservices-based web application. The primary goal of this architecture is to ensure scalability, fault isolation, and independent deployability of domain logic.

## System Context Diagram

```mermaid
graph TB
    User((End User / Admin))
    
    subgraph EventPulse System
        Gateway[API Gateway :5000]
        Frontend[React SPA :5173]
        
        Auth[Auth Service :5001]
        Theme[Theme Service :5002]
        Booking[Booking Service :5003]
        Payment[Payment Service :5004]
        Notification[Notification Service :5005]
        
        DB[(MySQL Database :3306)]
    end
    
    External_Razorpay[Razorpay API]
    External_SMTP[SMTP Server]
    
    User -->|HTTPS| Frontend
    Frontend -->|REST API| Gateway
    
    Gateway --> Auth
    Gateway --> Theme
    Gateway --> Booking
    Gateway --> Payment
    Gateway --> Notification
    
    Auth --> DB
    Theme --> DB
    Booking --> DB
    Payment --> DB
    
    Payment --> External_Razorpay
    Notification --> External_SMTP
```

## Core Components

### 1. Frontend (React 18 + Vite)
A Single Page Application (SPA) responsible for all user interfaces, including the public catalog, booking calculator, client portal, and admin dashboard. It communicates exclusively with the API Gateway.

### 2. API Gateway (Node.js/Express)
Acts as the single entry point for all frontend requests. 
- **Responsibilities**: Route proxying, Global Rate Limiting (100 req/15min), CORS enforcement, and Request Correlation ID generation.

### 3. Microservices (Node.js/Express)
Domain-driven services that handle specific business logic:
- **Auth Service**: Manages user identity, JWT issuance, and password resets.
- **Theme Service**: Manages the catalog of event packages and add-ons.
- **Booking Service**: Handles date availability, reservations, and CRM functionalities.
- **Payment Service**: Integrates with Razorpay for order creation and HMAC signature verification.
- **Notification Service**: An asynchronous service for dispatching emails and push notifications.

### 4. Data Layer (MySQL 8.0)
A normalized relational database that stores all application state. Services connect to it via a connection pool. A fallback in-memory store exists for rapid local development without a database engine.
