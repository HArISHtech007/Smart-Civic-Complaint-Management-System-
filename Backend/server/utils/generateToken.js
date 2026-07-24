const jwt = require('jsonwebtoken');

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  };

  res.cookie('jwt', token, cookieOptions);

  return token;
};

module.exports = generateToken;
