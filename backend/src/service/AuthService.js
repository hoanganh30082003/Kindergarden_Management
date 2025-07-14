const jwt = require('jsonwebtoken');
const AccountRepository = require('../repositories/AccountRepository');

const login = async (email, password) => {
  const user = await AccountRepository.findByEmailAndPassword(email,password);

  if (!user) {
    throw new Error('Invalid credentials');
  }
  await AccountRepository.updateLastLogin(user._id);
  const token = generateToken(user);
  return { token, user };
};

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
  return token;
};

module.exports = { login };
