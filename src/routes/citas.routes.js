const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const authenticateToken = require('../middlewares/auth');

// todas las rutas de citas requieren token
router.post('/', authenticateToken, citasController.createCita);
router.get('/mascota/:mascota_id', authenticateToken, citasController.getCitasByMascota);
router.get('/:id', authenticateToken, citasController.getCitaById);
router.put('/:id', authenticateToken, citasController.updateCita);
router.delete('/:id', authenticateToken, citasController.deleteCita);

module.exports = router;
