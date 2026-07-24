const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// Load environment variables (fallback if not loaded in server.js)
require('dotenv').config();

const app = express();

// 1) Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2) Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3) Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4) Main welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Smart Civic Complaint Management System API',
  });
});

// 5) Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// 6) Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
