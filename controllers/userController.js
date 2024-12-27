// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register new user
const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate input
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if user already exists
  const userExists = User.findByEmail(email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // Create new user
  try {
    const newUser = await User.create(fullName, email, password);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.' });
  }
};

// Login user and return JWT token
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Find user by email
  const user = User.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  // Create and sign JWT token
  const token = jwt.sign(
    { userId: user.email, fullName: user.fullName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

// Protected route to get user details (requires valid JWT)
const getUser = (req, res) => {
  res.json({ userId: req.user.userId, fullName: req.user.fullName });
};

module.exports = { register, login, getUser };
