const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// registro de nuevo usuario
exports.register = (req, res, next) => {
  const { nombre, correo, password, telefono } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ status: 'error', message: 'Nombre, correo y password son requeridos' });
  }

  // verificar si el correo ya existe
  db.query('SELECT id FROM users WHERE correo = ?', [correo], (err, results) => {
    if (err) return next(err);
    if (results.length > 0) {
      return res.status(400).json({ status: 'error', message: 'El correo ya esta registrado' });
    }

    // encriptar password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      const newUser = { nombre, correo, password: hashedPassword, telefono: telefono || null };

      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) return next(err);
        res.status(201).json({ status: 'success', message: 'Usuario registrado', id: result.insertId });
      });
    });
  });
};

// login de usuario
exports.login = (req, res, next) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ status: 'error', message: 'Correo y password son requeridos' });
  }

  db.query('SELECT * FROM users WHERE correo = ?', [correo], (err, results) => {
    if (err) return next(err);

    // mismo mensaje para usuario no encontrado o password incorrecta (seguridad)
    if (results.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Correo o password invalidos' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) return next(err);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Correo o password invalidos' });
      }

      // generar token JWT
      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ status: 'success', token });
    });
  });
};
