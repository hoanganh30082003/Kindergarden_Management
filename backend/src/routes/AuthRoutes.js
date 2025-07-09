const express = require('express');
const router = express.Router();
const authController = require('../controller/AuthController');
const authenticateToken = require('../middlewares/AuthMiddleware');

// Route login
router.post('/login', authController.login);

// Route bảo vệ bằng JWT
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!`, user: req.user });
});

module.exports =  router;
