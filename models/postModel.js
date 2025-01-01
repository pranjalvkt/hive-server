const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_file: { 
    data: Buffer, 
    contentType: String 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;