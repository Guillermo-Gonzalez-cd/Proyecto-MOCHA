const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const apiRoutes = require('./api_routes');
const adminRoutes = require('./admin.routes');
const citasRoutes = require('./citas.routes');

// rutas publicas de autenticacion
router.post('/register', authController.register);
router.post('/login', authController.login);

// rutas del CRUD general
router.use('/', apiRoutes);

// rutas de administracion (solo admin)
router.use('/admin', adminRoutes);

// rutas de citas
router.use('/citas', citasRoutes);

module.exports = router;
