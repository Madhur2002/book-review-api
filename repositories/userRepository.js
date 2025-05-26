// repositories/userRepository.js
const User = require('../models/User');

const findByUsername = (username) => {
  return User.findOne({ username });
};

const createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

module.exports = {
  findByUsername,
  createUser,
};
