const bcrypt = require("bcrypt");
const { getConnection } = require("../config/database");
const { validateUsername, validatePassword, sanitizeInput } = require("../utils/validation");

/**
 * Middleware function for password verification
 * Validates credentials against database and adds user info to request
 */
async function verifyPasswordMiddleware(req, res, next) {
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
      return res.status(401).json({ error: "Unauthorized - user not found" });
    }

    const user = users[0];

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Unauthorized - invalid credentials" });
    }

    // Add user info to request object for use in route handlers
    req.user = { username: user.username };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  verifyPasswordMiddleware,
};
