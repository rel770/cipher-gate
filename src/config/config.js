require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cipher_gate',
    port: process.env.DB_PORT || 3306
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

module.exports = config;
