# Deployment Guide

EventPulse uses Docker Compose to orchestrate its microservices architecture. This allows for reproducible builds and identical environments across development, staging, and production.

## Prerequisites
- Docker Engine v24.0+
- Docker Compose v2.0+

## Environment Configuration
The system relies heavily on environment variables to map inter-service networking and store secrets.

1. **Copy the example configuration:**
   ```bash
   cp .env.example .env
   ```
2. **Update the variables in `.env`:**
   - `JWT_SECRET`: Generate a secure random string.
   - `RAZORPAY_KEY_ID` / `SECRET`: Obtain from the Razorpay dashboard.
   - `SMTP_*`: Configure Nodemailer for Google Workspace, SendGrid, or AWS SES.

## Container Orchestration (`docker-compose.yml`)

The compose file defines 7 interconnected containers:

1. `mysql`: The database layer. Uses a healthcheck to ensure the daemon is ready before application services boot. Mounts `backend/migrations/create_tables.sql` into `/docker-entrypoint-initdb.d/` for auto-seeding.
2. `api-gateway`: Maps host port `5000` to container port `5000`. Uses the `.env` variables to proxy requests to internal hostnames.
3. `auth-service`, `theme-service`, `booking-service`, `payment-service`, `notification-service`: Node.js containers that expose internal ports (5001-5005) to the Docker network.

## Deployment Steps

1. **Build and start the containers in detached mode:**
   ```bash
   docker-compose up --build -d
   ```
2. **Verify container health:**
   ```bash
   docker-compose ps
   ```
   *Ensure the `mysql` service shows `(healthy)` and the microservices show `Up`.*
3. **Check API Gateway health:**
   Navigate to `http://localhost:5000/api/health` to verify the gateway can communicate with all downstream services.
4. **View live logs:**
   ```bash
   docker-compose logs -f
   ```

## Production Considerations
- **Frontend Serving**: The API Gateway is configured to serve the React static build (`frontend/dist`) via `express.static()` when `NODE_ENV=production`. You must run `npm run build` in the `frontend` folder before building the Docker images.
- **SSL Termination**: In a real-world scenario, you should place Nginx or AWS ALB in front of the API Gateway to handle SSL termination and forward port 443 to port 5000.
- **Database Persistence**: Ensure the Docker volume `db_data` is mounted to a persistent block storage (like AWS EBS) so data isn't lost on container restart.
