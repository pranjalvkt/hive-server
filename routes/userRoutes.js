const express = require('express');
const multer = require('multer');
const { 
    register, 
    login, 
    getUser, 
    updateUser, 
    getImageByUserId, 
    searchUsers,
    getUserDetailsForMessage
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken'); 
const validateIdParam = require("../middleware/validateIdParam");
const logger = require('../logger');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const logRequest = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
};
  
router.use(logRequest);

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser);
router.put("/updateUser/:id", upload.single('file'), updateUser);
router.get('/userImage/:id', validateIdParam, getImageByUserId);
router.get('/search', authenticateToken, searchUsers);
router.get('/getUserDetails/:id', getUserDetailsForMessage);
module.exports = router;