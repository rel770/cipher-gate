const { isAscendingOrder, calculateSum, isValidIntegerArray } = require("../utils/cipherUtils");

/**
 * Analyze encrypted messages and detect traps
 */
async function decodeMessage(req, res) {
  try {
    const { message } = req.body;
    const { username } = req.user;

    // Validate message input
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!isValidIntegerArray(message)) {
      return res.status(400).json({
        error: "Message must be an array of integers",
      });
    }

    if (message.length === 0) {
      return res.status(400).json({
        error: "Message array cannot be empty",
      });
    }

    // Check if message is a trap (not in ascending order)
    if (!isAscendingOrder(message)) {
      return res.status(200).json({
        result: -1,
        status: "Trap detected - message is not in ascending order",
        analyst: username,
        message: message,
      });
    }

    // Message is legit - calculate sum
    const sum = calculateSum(message);

    res.status(200).json({
      result: sum,
      status: "Legit message decoded successfully",
      analyst: username,
      message: message,
    });
  } catch (error) {
    console.error("Decode-message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get analyst profile (protected route example)
 */
async function getProfile(req, res) {
  try {
    const { username } = req.user;

    res.status(200).json({
      message: "Analyst profile accessed successfully",
      analyst: username,
      access_level: "Verified CipherNet Analyst",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  decodeMessage,
  getProfile,
};
