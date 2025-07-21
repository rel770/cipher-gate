const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const routes = require("./routes");
const { errorHandler, notFound, requestLogger } = require("./middleware/general");

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (only in development)
if (config.nodeEnv === "development") {
  app.use(requestLogger);
}

// Routes
app.use("/api", routes);

// Legacy routes for backward compatibility
const authController = require("./controllers/authController");
const cipherController = require("./controllers/cipherController");
const { verifyPasswordMiddleware } = require("./middleware/auth");

app.post("/signup", authController.signup);
app.post("/verify", authController.verify);
app.post("/decode-message", verifyPasswordMiddleware, cipherController.decodeMessage);
app.get("/profile", verifyPasswordMiddleware, cipherController.getProfile);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "CipherNet Authentication Service Online",
    version: "2.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      cipher: "/api/cipher",
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
