const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cipher_gate",
};

let connection = null;

async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error.message);
      throw error;
    }
  }
  return connection;
}

module.exports = { getConnection };
