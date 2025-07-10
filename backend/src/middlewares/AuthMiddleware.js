const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtConfig.jwtSecret, (err, user) => {
    if (err) {
        console.error("JWT Verification Error:", err.message); // Thêm log để dễ debug
        return res.sendStatus(403);
    }
    req.user = user;
    next();
});
}

module.exports = authenticateToken;
