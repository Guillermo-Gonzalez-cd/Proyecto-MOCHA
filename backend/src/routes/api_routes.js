const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud.controller');
const mascotasController = require('../controllers/mascotas.controller');
const authenticateToken = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// tablas con CRUD completo protegidas con JWT
const tablas = [
  'users',
  'mascotas',
  'medicamentos',
  'historial_medico',
  'alimentacion',
  'ciclo_reproductivo',
  'vacunas',
  'recordatorios'
];

tablas.forEach(tabla => {
  router.get(`/${tabla}`,      authenticateToken, crud.getAll(tabla));
  router.get(`/${tabla}/:id`,  authenticateToken, crud.getById(tabla));
  router.post(`/${tabla}`,     authenticateToken, crud.create(tabla));
  router.put(`/${tabla}/:id`,  authenticateToken, crud.update(tabla));
  router.delete(`/${tabla}/:id`, authenticateToken, crud.remove(tabla));
});

// subida de foto de una mascota especifica
// "foto" es el nombre del campo del formulario que debe usar el frontend
router.post(
  '/mascotas/:id/foto',
  authenticateToken,
  (req, res, next) => {
    upload.single('foto')(req, res, (err) => {
      if (err) {
        // errores conocidos de multer (archivo muy grande, tipo invalido, etc.)
        return res.status(400).json({ status: 'error', message: err.message });
      }
      next();
    });
  },
  mascotasController.subirFoto
);

module.exports = router;
