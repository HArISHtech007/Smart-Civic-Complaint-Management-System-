const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, department } = req.body;

  // 1) Simple presence validation
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error('Please provide name, email, phone, and password');
  }

  // 2) Check if user already exists by email or phone
  const userExists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });

  if (userExists) {
    res.status(400);
    const matchedField = userExists.email.toLowerCase() === email.toLowerCase() ? 'email' : 'phone';
    throw new Error(`A user with this ${matchedField} already exists`);
  }

  // 3) Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    department,
  });

  if (user) {
    // 4) Generate token and send cookie + response
    const token = generateToken(res, user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1) Validate credentials presence
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  // 2) Find user and explicitly select password
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // 3) Match credentials
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie by setting it to empty and expiring it immediately
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
