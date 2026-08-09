# Database Architecture

The EventPulse database is built on **MySQL 8.0** and is fully normalized (3NF) to ensure data integrity and prevent redundancy. The schema supports the entire lifecycle of user accounts, event catalog management, booking logistics, and financial transactions.

## ER Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : places
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    THEMES ||--o{ BOOKINGS : applies_to
    THEMES ||--o{ THEME_CATEGORY_MAPPING : grouped_in
    THEME_CATEGORIES ||--o{ THEME_CATEGORY_MAPPING : contains
    BOOKINGS ||--o{ BOOKING_ADD_ONS : contains
    ADD_ONS ||--o{ BOOKING_ADD_ONS : satisfies
    BOOKINGS ||--o{ PAYMENTS : records

    USERS {
        varchar id PK
        varchar username
        varchar email UK
        varchar password_hash
        timestamp created_at
        timestamp deleted_at
    }

    THEMES {
        varchar id PK
        varchar name
        text description
        decimal price
        timestamp created_at
        timestamp deleted_at
    }

    BOOKINGS {
        varchar id PK
        varchar theme_id FK
        varchar user_id FK
        date start_date
        date end_date
        decimal total_price
        int guest_count
        enum status
        timestamp created_at
    }

    ADD_ONS {
        varchar id PK
        varchar name
        decimal price
    }

    BOOKING_ADD_ONS {
        varchar booking_id PK, FK
        varchar add_on_id PK, FK
        int quantity
        decimal price_at_booking
    }

    PAYMENTS {
        varchar id PK
        varchar booking_id FK
        decimal amount
        enum status
        varchar gateway_signature
    }

    AUDIT_LOGS {
        varchar id PK
        varchar user_id FK
        varchar action
        varchar entity
        text details
        timestamp timestamp
    }
```

## Key Architectural Decisions

1. **UUID Primary Keys**: All tables use `VARCHAR(36)` UUIDs instead of auto-incrementing integers. This prevents resource enumeration and allows decentralized ID generation across microservices.
2. **Historical Financial Accuracy**: The `booking_add_ons` junction table captures `price_at_booking`. If an add-on's global price increases in the future, historical bookings and invoices remain mathematically accurate.
3. **Soft Deletion**: Core entities (`users`, `themes`, `bookings`) implement a `deleted_at` timestamp. This allows for data recovery and preserves referential integrity for historical audits.
4. **Audit Logging**: The `audit_logs` table provides an immutable ledger of system actions (logins, booking creations, cancellations) for security compliance.
