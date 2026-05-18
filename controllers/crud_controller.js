const db = require('../config/db');
const { validate } = require('../utils/validation');

exports.create = (tabla) => (req, res, next) => {
  // validar datos antes de insertar
  const { isValid, errors } = validate(tabla, req.body);
  if (!isValid) {
    return res.status(400).json({ status: 'error', errors });
  }

  db.query(`INSERT INTO ${tabla} SET ?`, req.body, (err) => {
    if (err) return next(err);
    res.status(201).json({ status: 'success', message: `${tabla} creado` });
  });
};

exports.getAll = (tabla) => (req, res, next) => {
  db.query(`SELECT * FROM ${tabla}`, (err, results) => {
    if (err) return next(err);
    res.json({ status: 'success', data: results });
  });
};

exports.getById = (tabla) => (req, res, next) => {
  db.query(`SELECT * FROM ${tabla} WHERE id = ?`, [req.params.id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No encontrado' });
    }
    res.json({ status: 'success', data: results[0] });
  });
};

exports.update = (tabla) => (req, res, next) => {
  // validar datos antes de actualizar
  const { isValid, errors } = validate(tabla, req.body);
  if (!isValid) {
    return res.status(400).json({ status: 'error', errors });
  }

  db.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [req.body, req.params.id], (err) => {
    if (err) return next(err);
    res.json({ status: 'success', message: `${tabla} actualizado` });
  });
};

exports.remove = (tabla) => (req, res, next) => {
  db.query(`DELETE FROM ${tabla} WHERE id = ?`, [req.params.id], (err) => {
    if (err) return next(err);
    res.status(204).send();
  });
};
