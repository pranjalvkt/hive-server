// models/userModel.js
const bcrypt = require('bcryptjs');

let users = []; // In-memory "database"

// User model to handle user-related operations
const User = {
  // Create a new user
  create: async (fullName, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { fullName, email, password: hashedPassword };
    users.push(newUser);
    return newUser;
  },

  // Find a user by email
  findByEmail: (email) => {
    return users.find((user) => user.email === email);
  },
};

module.exports = User;