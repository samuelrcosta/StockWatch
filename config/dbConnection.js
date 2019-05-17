const mysql = require('mysql');

// Set database connection credentials
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
};

// Create a MySQL pool
const pool = mysql.createPool(config);

//pool.on('release', () => console.log('pool => conexão retornada')); 

// Export the pool
module.exports = pool;