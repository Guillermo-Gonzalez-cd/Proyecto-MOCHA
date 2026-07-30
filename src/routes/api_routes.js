const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud.controller');
const authenticateToken = require('../middlewares/auth');

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

module.exports = router;
