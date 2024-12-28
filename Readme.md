# Hive - Backend API

Hive is a social media platform's backend API, providing user authentication, profile management, and real-time messaging using JWT tokens.

## Setup:
- Clone the repo, install dependencies, and configure environment variables (`MONGODB_URI`, `JWT_SECRET_KEY`).
- Start server with `node server`.

## API Endpoints:
1. **POST /api/register**: User registration.
2. **POST /api/login**: User login with JWT.
3. **GET /api/getUser**: Get user profile (protected).
4. **POST /api/chat**: Send chat messages.