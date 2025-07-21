const mysql = require('mysql2/promise');
const config = require('./config');

let connection = null;

async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(config.database);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw error;
    }
  }
  return connection;
}

async function closeConnection() {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('Database connection closed');
  }
}

module.exports = { 
  getConnection,
  closeConnection 
};
