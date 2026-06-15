const authService = require('../services/auth.service');

// registro de nuevo usuario
const register = async (req, res, next) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ status: 'error', message: 'Nombre, correo y password son requeridos' });
    }

    const user = await authService.createUser({ nombre, correo, password, telefono });
    res.status(201).json({ status: 'success', message: 'Usuario registrado', data: user });
  } catch (error) {
    next(error);
  }
};

// login de usuario
const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ status: 'error', message: 'Correo y password son requeridos' });
    }

    const result = await authService.loginUser({ correo, password });
    res.json({ status: 'success', token: result.token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
