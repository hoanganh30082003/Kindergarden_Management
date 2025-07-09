const authService = require('../service/AuthService');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await authService.login(username, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
