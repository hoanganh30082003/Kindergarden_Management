const authService = require('../service/AuthService');
const UserRepository = require('../repositories/UserRepository');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await authService.login(username, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

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
      message: `Hello ${user.username}!`,
      user: userProfile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};