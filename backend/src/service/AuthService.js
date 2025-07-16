const jwt = require('jsonwebtoken');
const AccountRepository = require('../repositories/AccountRepository');

const login = async (email, password) => {
  const account = await AccountRepository.findByEmailAndPassword(email,password);

  if (!account) {
    throw new Error('Invalid credentials');
  }
  await AccountRepository.updateLastLogin(account._id);
  const token = generateToken(account);
  return { token, account };
};

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
  return token;
};

const getProfile = async (userId) => {
  const user = await AccountRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = { login, getProfile };
