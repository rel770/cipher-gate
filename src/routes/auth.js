const express = require("express");
const { signup, verify } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/signup - Register a new analyst
router.post("/signup", signup);

// POST /api/auth/verify - Verify analyst credentials (legacy)
router.post("/verify", verify);

module.exports = router;
