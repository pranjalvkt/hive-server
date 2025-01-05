const Post = require('../models/postModel');

const createPost = async (req, res) => {
  const { title, description, userId, userEmail, userName } = req.body;

  if (!title || !description || !userId || !userEmail || !userName || !req.file) {
    return res.status(400).json({ message: "All fields are required including the image." });
  }

  try {
    const newPost = new Post({
      title,
      description,
      userId,
      userEmail,
      userName,
      image_file: {
        data: req.file.buffer, 
        contentType: req.file.mimetype,
      },
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully!',
      post: savedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getImageByPostId = async (req, res) => {
  const { id } = req.params;  

  try {
    const post = await Post.findById(id);

    if (!post || !post.image_file) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.contentType(post.image_file.contentType);
    res.send(post.image_file.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving image", error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ userId: id });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, userEmail, userName } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.userEmail = userEmail || post.userEmail;
    post.userName = userName || post.userName;

    if (req.file) {
      post.image_file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedPost = await post.save();
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createPost,
  getPostById,
  getImageByPostId,
  getAllPosts,
  updatePost,
  deletePost,
};