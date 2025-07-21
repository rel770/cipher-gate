const express = require("express");
const bcrypt = require("bcrypt");
const { getConnection } = require("./database/connection");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory storage for verified users (temporary solution)
const verifiedUsers = {};

// Constants
const SALT_ROUNDS = 10;

// Utility function to check if array is in ascending order (without built-in functions)
function isAscendingOrder(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

// Utility function to calculate sum without built-in functions
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CipherNet Authentication Service Online" });
});

// 1. Signup endpoint - Analyst Registration
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Get database connection
    const connection = await getConnection();

    // Check if username already exists
    const [existingUsers] = await connection.execute("SELECT username FROM users WHERE username = ?", [
      username,
    ]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user into database
    await connection.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({
      message: "Analyst registered successfully",
      username: username,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Verify endpoint - Password Checkpoint
app.post("/verify", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Get database connection
    const connection = await getConnection();

    // Get user from database
    const [users] = await connection.execute("SELECT username, password_hash FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = users[0];

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mark user as verified in memory
    verifiedUsers[username] = true;

    res.status(200).json({ message: "Verified" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Decode-message endpoint - Cipher Analysis
app.post("/decode-message", (req, res) => {
  try {
    const { username, message } = req.body;

    // Validate input
    if (!username || !message) {
      return res.status(400).json({ error: "Username and message are required" });
    }

    if (!Array.isArray(message)) {
      return res.status(400).json({ error: "Message must be an array of integers" });
    }

    // Check if user is verified
    if (!verifiedUsers[username]) {
      return res.status(401).json({ error: "Analyst not verified. Please verify credentials first." });
    }

    // Check if message is a trap (not in ascending order)
    if (!isAscendingOrder(message)) {
      return res.status(200).json({ 
        result: -1,
        status: "Trap detected - message is not in ascending order"
      });
    }

    // Message is legit - calculate sum
    const sum = calculateSum(message);
    
    res.status(200).json({ 
      result: sum,
      status: "Legit message decoded successfully"
    });

  } catch (error) {
    console.error("Decode-message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`CipherNet server running on port ${PORT}`);
});
