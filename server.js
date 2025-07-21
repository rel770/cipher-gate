const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cipher_gate",
};

// In-memory storage for verified users (temporary solution)
const verifiedUsers = {};

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CipherNet Authentication Service Online" });
});

// Start server
app.listen(PORT, () => {
  console.log(`CipherNet server running on port ${PORT}`);
});
