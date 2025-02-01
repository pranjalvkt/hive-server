const express = require('express');
const multer = require('multer');
const logger = require("../logger");
const { createPost, getPostById, getAllPosts, updatePost, deletePost, getImageByPostId } = require('../controllers/postController');
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const logRequest = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  };
  
router.use(logRequest);

router.post('/create', upload.single('file'), createPost);
router.get('/:id', getPostById);
router.get('/image/:id', getImageByPostId);
router.get('/', authenticateToken, getAllPosts);
router.put('/:id', upload.single('file'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;