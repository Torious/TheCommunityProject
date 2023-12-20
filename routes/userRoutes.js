const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path according to your project structure
// Assuming you have an authentication middleware
const authenticate = require('../utils/auth'); 
const { generateToken } = require('../utils/jwtUtils');
const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      // Generate JWT token
      const token = generateToken(user._id);
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error registering new user' });
    }
  });

// PUT /api/users/:id - Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, profilePicture, /* other fields */ } = req.body;

    // Optional: Check if the request is from the authenticated user
    if (req.user.id !== id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find user by ID and update
    const user = await User.findByIdAndUpdate(id, { 
      username, 
      profilePicture, 
      // other fields
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with updated user data (excluding sensitive fields)
    res.json({ 
      id: user._id, 
      username: user.username,
      profilePicture: user.profilePicture,
      // other fields
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// PUT /api/users/:id/password - Change Password
router.put('/:id/password', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      // Ensure the request is from the authenticated user
      if (req.user.id !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check old password
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }
  
      // Hash new password and update
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating password' });
    }
  });
  
  // PUT /api/users/:id/email - Update Email Preferences
  router.put('/:id/email', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { newEmail } = req.body; // Assuming you're only updating the email
  
      if (req.user.id !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Update email preferences
      const user = await User.findByIdAndUpdate(id, { email: newEmail }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Email updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating email' });
    }
  });

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = generateToken(user._id);
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });
  
module.exports = router;
