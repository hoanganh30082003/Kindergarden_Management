const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, account) => {
    if (err) return res.sendStatus(403); // Token không hợp lệ
    req.account = account;
    next();
});
}

module.exports = authenticateToken;
