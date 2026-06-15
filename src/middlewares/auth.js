const jwt = require('jsonwebtoken');

// verifica que el token JWT sea valido
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Token invalido o expirado' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
