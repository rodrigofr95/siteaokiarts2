const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'siteaokiart'
});

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('MySQL connected');
    connection.release();
  });
};

module.exports = { pool, connectDB };
