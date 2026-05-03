const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud_controller');

const tablas = [
  'duenos',
  'mascotas',
  'medicamentos',
  'historial_medico',
  'alimentacion',
  'ciclo_reproductivo',
  'vacunas',
  'recordatorios'
];

tablas.forEach(tabla => {
  router.get(`/${tabla}/:id`, crud.getById(tabla));
  router.post(`/${tabla}`, crud.create(tabla));
  router.get(`/${tabla}`, crud.getAll(tabla));
  router.put(`/${tabla}/:id`, crud.update(tabla));
  router.delete(`/${tabla}/:id`, crud.remove(tabla));
});

module.exports = router;