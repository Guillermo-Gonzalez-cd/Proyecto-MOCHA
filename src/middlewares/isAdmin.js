// verifica que el usuario autenticado tenga rol de admin
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
  }
  next();
};

module.exports = isAdmin;
