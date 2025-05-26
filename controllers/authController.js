// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByUsername, createUser } = require('../repositories/userRepository');
const { JWT_SECRET } = process.env;


/**
 * POST /auth/signup
 * Register a new user with username and password
*/
const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (await findByUsername(username)) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Hash password and create user
  const hashed = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, password: hashed });
  res.status(201).json({ message: 'User created', userId: newUser._id });
};


/**
 * POST /auth/login
 * Authenticate user and return JWT token
*/
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

module.exports = {
  signup,
  login,
};
