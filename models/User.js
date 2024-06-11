// models/User.js
const { pool } = require('../config/db');

const createUser = (userData, callback) => {
  const { username, email, password } = userData;
  pool.query(
    'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, { id: results.insertId, username, email });
    }
  );
};

module.exports = { createUser };
