const Sequelize = require('sequelize');

const connectDB = async () => {
  try {
    const sequelize = new Sequelize('database_name', 'username', 'password', {
      host: 'localhost',
      dialect: 'mysql'
    });
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectDB();
