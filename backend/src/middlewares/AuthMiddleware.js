const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // Token không hợp lệ
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
