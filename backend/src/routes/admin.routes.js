const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// todas las rutas de admin requieren token valido y rol admin
router.post('/timeblocks', authenticateToken, isAdmin, adminController.createTimeBlock);
router.get('/timeblocks', authenticateToken, isAdmin, adminController.listTimeBlocks);
router.get('/citas', authenticateToken, isAdmin, adminController.listAllCitas);

module.exports = router;
