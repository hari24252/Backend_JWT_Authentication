# Node Auth API Documentation

This API supports JWT authentication and health checking. 

To import these endpoints into Postman directly, use the Postman Collection definition file:
[node-auth.postman_collection.json](file:///home/hariharan/node-auth/node-auth.postman_collection.json)

---

## 1. Health Check

Checks the API server status and the PostgreSQL database connectivity.

- **URL:** `/health`
- **Method:** `GET`
- **Headers:** None
- **Body:** None
- **Responses:**
  - **`200 OK`**: Database and server are normal.
    ```json
    {
      "status": "ok",
      "database": "connected"
    }
    ```
  - **`503 Service Unavailable`**: Database is offline.
    ```json
    {
      "status": "error",
      "database": "disconnected"
    }
    ```

Defined in [index.js](file:///home/hariharan/node-auth/src/index.js#L13-L20).

---

## 2. Register User

Registers a new user account and returns a JWT authentication token.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
  - `name` (string, required): Minimum 2 characters.
  - `email` (string, required): Valid email format.
  - `password` (string, required): Minimum 8 characters.
  - *Example:*
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "strongPassword123"
    }
    ```
- **Responses:**
  - **`201 Created`**: User has been created successfully.
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "email": "jane@example.com",
        "name": "Jane Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **`400 Bad Request`**: Missing/invalid fields.
    ```json
    { "error": "Valid email is required" }
    ```
    ```json
    { "error": "Password must be at least 8 characters" }
    ```
    ```json
    { "error": "Name must be at least 2 characters" }
    ```
  - **`409 Conflict`**: Email already registered.
    ```json
    { "error": "Email already registered" }
    ```

Defined in [authController.js:register](file:///home/hariharan/node-auth/src/controllers/authController.js#L19-L46) and routed in [auth.js](file:///home/hariharan/node-auth/src/routes/auth.js#L7).

---

## 3. Login User

Logs in an existing user and returns a JWT authentication token.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
  - `email` (string, required): Valid email address.
  - `password` (string, required): User password.
  - *Example:*
    ```json
    {
      "email": "jane@example.com",
      "password": "strongPassword123"
    }
    ```
- **Responses:**
  - **`200 OK`**: Login successful.
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "email": "jane@example.com",
        "name": "Jane Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **`400 Bad Request`**: Fields missing or invalid format.
    ```json
    { "error": "Email and password are required" }
    ```
  - **`401 Unauthorized`**: Incorrect email or password.
    ```json
    { "error": "Invalid email or password" }
    ```

Defined in [authController.js:login](file:///home/hariharan/node-auth/src/controllers/authController.js#L48-L72) and routed in [auth.js](file:///home/hariharan/node-auth/src/routes/auth.js#L8).

---

## 4. Get Profile

Retrieves the currently authenticated user's profile info.

- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>` (required)
- **Body:** None
- **Responses:**
  - **`200 OK`**: Retrieved profile successfully.
    ```json
    {
      "user": {
        "id": 1,
        "email": "jane@example.com",
        "name": "Jane Doe",
        "password_hash": "$2a$12$...",
        "created_at": "2026-07-16T10:21:40.000Z"
      }
    }
    ```
  - **`401 Unauthorized`**: Missing or invalid/expired authentication credentials.
    ```json
    { "error": "Access token required" }
    ```
    ```json
    { "error": "Token expired" }
    ```
    ```json
    { "error": "Invalid token" }
    ```

Defined in [authController.js:getProfile](file:///home/hariharan/node-auth/src/controllers/authController.js#L74-L76), routed in [auth.js](file:///home/hariharan/node-auth/src/routes/auth.js#L9), and validated using [auth.js middleware](file:///home/hariharan/node-auth/src/middleware/auth.js).

---

## 5. Get All Users

Retrieves the list of all registered users in the database.

- **URL:** `/api/auth/users`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>` (required)
- **Body:** None
- **Responses:**
  - **`200 OK`**: Retrieved users successfully.
    ```json
    {
      "users": [
        {
          "id": 1,
          "email": "jane@example.com",
          "name": "Jane Doe",
          "created_at": "2026-07-16T10:21:40.000Z"
        }
      ]
    }
    ```
  - **`401 Unauthorized`**: Missing or invalid/expired authentication credentials.
    ```json
    { "error": "Access token required" }
    ```

Defined in [authController.js:getAllUsers](file:///home/hariharan/node-auth/src/controllers/authController.js#L78-L86), routed in [auth.js](file:///home/hariharan/node-auth/src/routes/auth.js#L10), and validated using [auth.js middleware](file:///home/hariharan/node-auth/src/middleware/auth.js).
