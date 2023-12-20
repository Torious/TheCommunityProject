require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_STRING;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Could not connect to MongoDB: ", err));

const express = require('express');
const app = express();

// Use userRoutes for any route starting with '/api/users'
app.use('/api/users', userRoutes);

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the User Management System');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
