const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');

const login = async (username, password) => {
  const user = await User.findOne({ username, password });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  return { token, user };
};

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { login };
