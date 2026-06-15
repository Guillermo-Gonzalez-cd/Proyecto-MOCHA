const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// crea un nuevo usuario en la base de datos
const createUser = async ({ nombre, correo, password, telefono }) => {
  // verificar si el correo ya existe
  const [existing] = await db.query('SELECT id FROM users WHERE correo = ?', [correo]);
  if (existing.length > 0) {
    const error = new Error('El correo ya esta registrado');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { nombre, correo, password: hashedPassword, telefono: telefono || null };
  const [result] = await db.query('INSERT INTO users SET ?', newUser);

  return { id: result.insertId, nombre, correo };
};

// valida credenciales y retorna un token JWT
const loginUser = async ({ correo, password }) => {
  const [results] = await db.query('SELECT * FROM users WHERE correo = ?', [correo]);

  // mismo mensaje para no revelar si el correo existe o no
  if (results.length === 0) {
    const error = new Error('Correo o password invalidos');
    error.statusCode = 401;
    throw error;
  }

  const user = results[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    const error = new Error('Correo o password invalidos');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token };
};

module.exports = { createUser, loginUser };
