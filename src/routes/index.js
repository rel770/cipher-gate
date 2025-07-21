const express = require("express");
const authRoutes = require("./auth");
const cipherRoutes = require("./cipher");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CipherNet Authentication Service Online",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/cipher", cipherRoutes);

module.exports = router;
