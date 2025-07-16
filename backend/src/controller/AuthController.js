const authService = require('../service/AuthService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, account } = await authService.login(email, password);
    res.json({ token, account });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    const userProfile = {
      id: user._id,
      username: user.username,
      role: user.role,
      system_name: user.system_name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      last_login: user.last_login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    res.json({
      success: true,
      message: `Hello ${user.username || user.email}!`,
      user: userProfile
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};