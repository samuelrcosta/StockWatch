let mysql = require('mysql');

let connMySQL = function(){
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });
};

module.exports = connMySQL;
