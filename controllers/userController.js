const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const fs = require("fs");
const path = require("path");

const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration attempt failed: User already exists with email ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const blankPhotoPath = path.join(__dirname, "../assets/blank_photo.png");
    const blankPhotoBuffer = fs.readFileSync(blankPhotoPath);
    
    
    const newUser = new User({ fullName, email, password: hashedPassword, profilePic:  {
      data: blankPhotoBuffer,
      contentType: "image/png",
    }});

    

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    logger.error(`Error registering user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      logger.warn(`User not found for update`);
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;

    if (req.file) {
      user.profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User deatils updated successfully',
      user: { user_id: updatedUser._id, user_email: updatedUser.email, user_name: updatedUser.fullName, profilePic: updatedUser.profilePic },
    });
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: Invalid credentials for email ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token: token, user_id: user._id, user_email: user.email, user_name: user.fullName });
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      logger.warn(`User not found`);
      return res.status(200).json({ message: "User not found" });
    }
    res.status(200).json({ user_id: user._id, user_email: user.email, user_name: user.fullName, profilePic: user?.profilePic });
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    res.status(500).json({ message: "Server error." });
  }
};

const searchUsers = async (req, res) => {
  const { q } = req.query;
  const { id } = req.params;
  
  if (!q) {
    logger.warn("Search query is empty");
    return res.status(400).json({ message: "Search query cannot be empty." });
  }

  try {
    const users = await User.find({ 
      fullName: { $regex: q, $options: "i" },
      _id: { $ne: id }
    }).select("-password");

    if (users.length === 0) {
      logger.info(`No users found matching query: ${q}`);
      return res.status(200).json({ message: "No users found." });
    }
    const userResults = users.map(user => ({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user?.profilePic
    }));

    res.status(200).json(userResults);
  } catch (err) {
    logger.error(`Error searching users: ${err.message}`);
    res.status(500).json({ message: "Server error." });
  }
};

const getImageByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      logger.warn(`User profile picture not found`);
      return res.status(200).json({ message: "Profile picture not found" });
    }

    res.contentType(user?.profilePic?.contentType);
    res.send(user?.profilePic?.data);
  } catch (err) {
    logger.error(`Error retrieving image for user ${id}: ${err.message}`);
    res.status(500).json({ message: "Error retrieving image", error: err.message });
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      logger.warn('User not found');
      return res.status(200).json({ message: 'User not found' });
    }
    res.status(200).json({
      user_id: user._id,
      user_name: user.fullName,
      profilePic: user?.profilePic,
      user_email: user?.email,
    });
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getUser, updateUser, getImageByUserId, searchUsers, getUserDetails };
