const Post = require('../models/postModel');

// Create a new post
const createPost = async (req, res) => {
  const { title, description, userId, userEmail, userName } = req.body;

  // Ensure all required fields are present
  if (!title || !description || !userId || !userEmail || !userName || !req.file) {
    return res.status(400).json({ message: "All fields are required including the image." });
  }

  try {
    // Create a new Post document, saving the image as binary data
    const newPost = new Post({
      title,
      description,
      userId,
      userEmail,
      userName,
      image_file: {
        data: req.file.buffer, // Save file as binary data
        contentType: req.file.mimetype, // Save MIME type (e.g., image/jpeg, image/png)
      },
    });

    // Save the new post to the database
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

// Get post by ID
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

    // Set the correct content type for the image
    res.contentType(post.image_file.contentType); // For example, image/jpeg
    res.send(post.image_file.data); // Send the binary data (Buffer)

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving image", error: err.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, userEmail, userName } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the fields that were provided
    post.title = title || post.title;
    post.description = description || post.description;
    post.userEmail = userEmail || post.userEmail;
    post.userName = userName || post.userName;

    // If a new file is uploaded, update the image
    if (req.file) {
      post.image_file = {
        data: req.file.buffer, // Update with the new binary file data
        contentType: req.file.mimetype, // Update the MIME type
      };
    }

    const updatedPost = await post.save(); // Save the updated post
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.remove(); // Remove the post from the database
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