const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'rodrigo',
  password: 'RodriFr@95#29',
  database: 'siteaokiarts'
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
