const db = require('../config/db');
const { validate } = require('../utils/validation');

exports.create = (tabla) => async (req, res, next) => {
  try {
    // validar datos antes de insertar
    const { isValid, errors } = validate(tabla, req.body);
    if (!isValid) {
      return res.status(400).json({ status: 'error', errors });
    }

    const [result] = await db.query(`INSERT INTO ${tabla} SET ?`, req.body);
    res.status(201).json({ status: 'success', message: `${tabla} creado`, id: result.insertId });
  } catch (error) {
    next(error);
  }
};

exports.getAll = (tabla) => async (req, res, next) => {
  try {
    const [results] = await db.query(`SELECT * FROM ${tabla}`);
    res.json({ status: 'success', data: results });
  } catch (error) {
    next(error);
  }
};

exports.getById = (tabla) => async (req, res, next) => {
  try {
    const [results] = await db.query(`SELECT * FROM ${tabla} WHERE id = ?`, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No encontrado' });
    }
    res.json({ status: 'success', data: results[0] });
  } catch (error) {
    next(error);
  }
};

exports.update = (tabla) => async (req, res, next) => {
  try {
    // validar datos antes de actualizar
    const { isValid, errors } = validate(tabla, req.body);
    if (!isValid) {
      return res.status(400).json({ status: 'error', errors });
    }

    await db.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [req.body, req.params.id]);
    res.json({ status: 'success', message: `${tabla} actualizado` });
  } catch (error) {
    next(error);
  }
};

exports.remove = (tabla) => async (req, res, next) => {
  try {
    await db.query(`DELETE FROM ${tabla} WHERE id = ?`, [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
