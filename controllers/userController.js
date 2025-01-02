const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;

  try {
    const user = await User.findById(id).select("-password");;

    if (!user) {
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
      message: 'Post updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token: token, user_id: user._id, user_email: user.email, user_name: user.fullName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude password field
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const getImageByUserId = async (req, res) => {
  const { id } = req.params;  

  try {
    const user = await User.findById(id);

    if (!user || !user.profilePic) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.contentType(user.profilePic.contentType);
    res.send(user.profilePic.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving image", error: err.message });
  }
};

module.exports = { register, login, getUser, updateUser, getImageByUserId };