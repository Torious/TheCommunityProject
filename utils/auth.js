const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwtUtils');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token.');
    }

    req.user = decoded; // Add the user ID to the request object
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = authenticate;

