const express = require("express");
const { decodeMessage, getProfile } = require("../controllers/cipherController");
const { verifyPasswordMiddleware } = require("../middleware/auth");

const router = express.Router();

// POST /api/cipher/decode-message - Analyze encrypted messages (protected)
router.post("/decode-message", verifyPasswordMiddleware, decodeMessage);

// GET /api/cipher/profile - Get analyst profile (protected)
router.get("/profile", verifyPasswordMiddleware, getProfile);

module.exports = router;
