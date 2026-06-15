const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const apiRoutes = require('./api_routes');

// rutas publicas de autenticacion
router.post('/register', authController.register);
router.post('/login', authController.login);

// rutas del CRUD
router.use('/', apiRoutes);

module.exports = router;
