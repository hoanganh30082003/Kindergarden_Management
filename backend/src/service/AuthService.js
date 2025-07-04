const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const login = async (username, password) => {
  const user = await UserRepository.findByUsernameAndPassword(username,password);

  if (!user) {
    throw new Error('Invalid credentials');
  }
  await UserRepository.updateLastLogin(user._id);
  const token = generateToken(user);
  return { token, user };
};

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
  return token;
};

module.exports = { login };
