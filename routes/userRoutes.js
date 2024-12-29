const express = require('express');
const { register, login, getUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken'); 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser);

module.exports = router;