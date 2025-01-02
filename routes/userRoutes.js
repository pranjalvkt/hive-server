const express = require('express');
const multer = require('multer');
const { register, login, getUser, updateUser, getImageByUserId } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken'); 
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser);
router.put("/updateUser/:id", upload.single('file'), updateUser);
router.get('/userImage/:id', getImageByUserId);

module.exports = router;