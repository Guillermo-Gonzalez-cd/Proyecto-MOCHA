const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// registro de nuevo usuario
exports.register = async (req, res, next) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ status: 'error', message: 'Nombre, correo y password son requeridos' });
    }

    // verificar si el correo ya existe
    const [existing] = await db.query('SELECT id FROM users WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'El correo ya esta registrado' });
    }

    // encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { nombre, correo, password: hashedPassword, telefono: telefono || null };
    const [result] = await db.query('INSERT INTO users SET ?', newUser);

    res.status(201).json({ status: 'success', message: 'Usuario registrado', id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// login de usuario
exports.login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ status: 'error', message: 'Correo y password son requeridos' });
    }

    const [results] = await db.query('SELECT * FROM users WHERE correo = ?', [correo]);

    // mismo mensaje para usuario no encontrado o password incorrecta (seguridad)
    if (results.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Correo o password invalidos' });
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);

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
  } catch (error) {
    next(error);
  }
};
