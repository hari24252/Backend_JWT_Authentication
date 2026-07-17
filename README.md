# Node Auth — JWT Backend

Backend authentication API built with **Node.js**, **Express**, and **PostgreSQL**, using **JSON Web Tokens (JWT)** for stateless auth.

## Features

- User registration with bcrypt password hashing
- Login returning a signed JWT
- Protected route to fetch the current user profile
- PostgreSQL user storage
- Health check endpoint

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your PostgreSQL credentials and a strong `JWT_SECRET`.

3. **Create the database**

   ```bash
   createdb node_auth
   ```

4. **Run migrations**

   ```bash
   npm run db:init
   ```

5. **Start the server**

   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:3000`.

## API Endpoints

### Health check

```
GET /health
```

### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": { "id": 1, "email": "jane@example.com", "name": "Jane Doe" },
  "token": "eyJhbG..."
}
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "user": { "id": 1, "email": "jane@example.com", "name": "Jane Doe" },
  "token": "eyJhbG..."
}
```

### Get current user (protected)

```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Doe",
    "created_at": "2026-07-14T..."
  }
}
```

## Project structure

```
node-auth/
├── migrations/init.sql       # Database schema
├── scripts/init-db.js        # Migration runner
├── src/
│   ├── config/db.js          # PostgreSQL pool
│   ├── controllers/          # Route handlers
│   ├── middleware/auth.js    # JWT verification
│   ├── models/user.js        # User queries
│   ├── routes/auth.js        # Auth routes
│   ├── utils/jwt.js          # Token sign/verify
│   └── index.js              # Express app entry
├── .env.example
└── package.json
```

## Example curl commands

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"securepassword"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"securepassword"}'

# Get profile (replace TOKEN)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```
