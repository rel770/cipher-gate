# Cipher Gate - CipherNet Authentication Service v2.0

A secure backend authentication system for CipherNet intelligence analysts. The service provides user registration, authentication, and secure message analysis capabilities with a professional modular architecture.

## Features

- **Secure User Registration**: Password hashing with bcrypt
- **Authentication Verification**: Credential validation with secure password comparison  
- **Message Analysis**: Cipher analysis with trap detection (ascending order check)
- **Middleware Authentication**: Reusable authentication middleware for protected routes
- **Modular Architecture**: Organized with controllers, middleware, routes, and utilities
- **Environment Configuration**: Flexible configuration with .env support
- **Error Handling**: Comprehensive error handling and logging
- **Input Validation**: Advanced input validation and sanitization

## Project Structure

```
cipher-gate/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── config.js          # Environment configuration
│   │   └── database.js        # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── cipherController.js # Cipher analysis logic
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── general.js         # General middleware (error, logging)
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   ├── auth.js            # Authentication routes
│   │   └── cipher.js          # Cipher routes
│   └── utils/
│       ├── cipherUtils.js     # Cipher utility functions
│       └── validation.js      # Input validation utilities
├── database/
│   └── setup.sql              # Database schema
├── server.js                  # Server entry point
├── .env.example               # Environment variables example
├── .env                       # Environment variables (ignored by git)
└── README.md                  # Documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (via XAMPP or standalone)
- npm

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

4. Set up the database:
   - Start MySQL (via XAMPP or standalone)
   - Import the database schema from `database/setup.sql`

5. Start the server:
```bash
npm run dev  # Development mode with auto-restart
npm start    # Production mode
```

The server runs on `http://localhost:3000`

## Database Setup

Execute the SQL commands in `database/setup.sql` to create the database and users table:

```sql
CREATE DATABASE IF NOT EXISTS cipher_gate;
USE cipher_gate;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Legacy Endpoints (Backward Compatibility)

#### 1. Analyst Registration
**POST** `/signup`

#### 2. Password Verification  
**POST** `/verify`

#### 3. Message Analysis
**POST** `/decode-message`

#### 4. Analyst Profile
**GET** `/profile`

### New API Endpoints (v2.0)

#### Health Check
**GET** `/api/health`

Check service status and health.

**Response (200):**
```json
{
  "status": "OK",
  "message": "CipherNet Authentication Service Online",
  "timestamp": "2025-07-21T10:30:00.000Z",
  "version": "2.0.0"
}
```

#### Authentication Routes

**POST** `/api/auth/signup` - Register a new analyst
**POST** `/api/auth/verify` - Verify analyst credentials

#### Cipher Routes (Protected)

**POST** `/api/cipher/decode-message` - Analyze encrypted messages
**GET** `/api/cipher/profile` - Get analyst profile

### Request/Response Examples

#### 1. Analyst Registration
**POST** `/signup` or `/api/auth/signup`

Register a new analyst with secure password hashing.

**Request Body:**
```json
{
  "username": "noa",
  "password": "secure123"
}
```

**Response (201):**
```json
{
  "message": "Analyst registered successfully",
  "username": "noa"
}
```

### 2. Password Verification (Legacy)
**POST** `/verify`

Verify analyst credentials and mark as verified in memory.

**Request Body:**
```json
{
  "username": "noa",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "message": "Verified"
}
```

### 3. Message Analysis (with Middleware Authentication)
**POST** `/decode-message`

Analyze encoded messages for traps and decode legitimate communications.

**Request Body:**
```json
{
  "username": "noa",
  "password": "secure123",
  "message": [1, 3, 4, 9]
}
```

**Response for Legitimate Message (200):**
```json
{
  "result": 17,
  "status": "Legit message decoded successfully",
  "analyst": "noa"
}
```

**Response for Trap Message (200):**
```json
{
  "result": -1,
  "status": "Trap detected - message is not in ascending order",
  "analyst": "noa"
}
```

### 4. Analyst Profile (Protected Route Example)
**GET** `/profile`

Access analyst profile information (requires authentication via middleware).

**Request Body:**
```json
{
  "username": "noa",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "message": "Analyst profile accessed successfully",
  "analyst": "noa",
  "access_level": "Verified CipherNet Analyst"
}
```

## Testing Examples

### Using curl:

0. **Health check:**
```bash
curl -X GET http://localhost:3000/api/health
```

1. **Register a new analyst (Legacy):**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

1b. **Register a new analyst (New API):**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

2. **Verify credentials:**
```bash
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

3. **Analyze legitimate message (Legacy):**
```bash
curl -X POST http://localhost:3000/decode-message \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123", "message": [1, 3, 4, 9]}'
```

3b. **Analyze legitimate message (New API):**
```bash
curl -X POST http://localhost:3000/api/cipher/decode-message \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123", "message": [1, 3, 4, 9]}'
```

4. **Analyze trap message:**
```bash
curl -X POST http://localhost:3000/decode-message \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123", "message": [4, 3, 9, 1]}'
```

5. **Access protected profile:**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

## Architecture

- **Express.js**: Web framework for API endpoints
- **MySQL2**: Database connectivity with promise support
- **bcrypt**: Secure password hashing
- **Middleware Pattern**: Clean separation of authentication logic
