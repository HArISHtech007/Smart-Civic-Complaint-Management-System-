const path = require('path');
const dotenv = require('dotenv');

// 1) Load environment variables at the very beginning
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');

// Handle uncaught exception errors globally
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// 2) Establish MongoDB Connection
connectDB();

// 3) Start Express Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
