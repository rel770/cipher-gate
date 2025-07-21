const bcrypt = require("bcrypt");
const { getConnection } = require("../config/database");
const { validateUsername, validatePassword, sanitizeInput } = require("../utils/validation");
const config = require("../config/config");

/**
 * Register a new analyst
 */
async function signup(req, res) {
  try {
    let { username, password } = req.body;

    // Sanitize inputs
    username = sanitizeInput(username);

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ error: usernameValidation.message });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
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
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptSaltRounds);

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
}

/**
 * Verify analyst credentials (legacy endpoint)
 */
async function verify(req, res) {
  try {
    let { username, password } = req.body;

    // Sanitize inputs
    username = sanitizeInput(username);

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ error: usernameValidation.message });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
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

    res.status(200).json({ message: "Verified" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  signup,
  verify,
};
