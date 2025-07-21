# Cipher Gate - CipherNet Authentication Service

A secure backend authentication system for CipherNet intelligence analysts. The service provides user registration, authentication, and secure message analysis capabilities.

## Features

- **Secure User Registration**: Password hashing with bcrypt
- **Authentication Verification**: Credential validation with secure password comparison  
- **Message Analysis**: Cipher analysis with trap detection (ascending order check)
- **Middleware Authentication**: Reusable authentication middleware for protected routes

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

3. Set up the database:
   - Start MySQL (via XAMPP or standalone)
   - Import the database schema from `database/setup.sql`

4. Start the server:
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

### 1. Analyst Registration
**POST** `/signup`

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

1. **Register a new analyst:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

2. **Verify credentials:**
```bash
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '{"username": "noa", "password": "secure123"}'
```

3. **Analyze legitimate message:**
```bash
curl -X POST http://localhost:3000/decode-message \
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

## Security Features

- **bcrypt Password Hashing**: All passwords are securely hashed with salt rounds
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **Input Validation**: Comprehensive validation for all endpoints
- **Middleware Authentication**: Reusable authentication for protected routes

## Architecture

- **Express.js**: Web framework for API endpoints
- **MySQL2**: Database connectivity with promise support
- **bcrypt**: Secure password hashing
- **Middleware Pattern**: Clean separation of authentication logic

## Development Branches

The project was developed using a feature branch workflow:

- `feature/signup-endpoint`: User registration functionality
- `feature/verify-endpoint`: Password verification system
- `feature/decode-message-endpoint`: Message analysis capabilities
- `feature/middleware-auth`: Authentication middleware implementation

Each feature was developed, tested, and merged separately for clean commit history.
