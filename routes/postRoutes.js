const express = require('express');
const multer = require('multer');
const { createPost, getPostById, getAllPosts, updatePost, deletePost, getImageByPostId } = require('../controllers/postController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.single('file'), createPost);
router.get('/:id', getPostById);
router.get('/image/:id', getImageByPostId);
router.get('/', getAllPosts);
router.put('/:id', upload.single('file'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;