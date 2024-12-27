// routes/userRoutes.js
const express = require('express');
const { register, login, getUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken'); // JWT authentication middleware

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login and get JWT token
router.post('/login', login);

// Protected route to get user info
router.get('/user', authenticateToken, getUser);

module.exports = router;
