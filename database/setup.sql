-- Create database
CREATE DATABASE IF NOT EXISTS cipher_gate;
-- Use the database
USE cipher_gate;
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Display table structure
DESCRIBE users;