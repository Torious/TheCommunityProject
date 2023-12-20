const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret'; // Should be in an environment variable

// Generate a token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
};

// Verify a token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
