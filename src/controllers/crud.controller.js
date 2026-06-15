const crudService = require('../services/crud.service');
const { validate } = require('../utils/validation');

const create = (tabla) => async (req, res, next) => {
  try {
    const { isValid, errors } = validate(tabla, req.body);
    if (!isValid) {
      return res.status(400).json({ status: 'error', errors });
    }

    const result = await crudService.create(tabla, req.body);
    res.status(201).json({ status: 'success', message: `${tabla} creado`, id: result.id });
  } catch (error) {
    next(error);
  }
};

const getAll = (tabla) => async (req, res, next) => {
  try {
    const data = await crudService.getAll(tabla);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

const getById = (tabla) => async (req, res, next) => {
  try {
    const data = await crudService.getById(tabla, req.params.id);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

const update = (tabla) => async (req, res, next) => {
  try {
    const { isValid, errors } = validate(tabla, req.body);
    if (!isValid) {
      return res.status(400).json({ status: 'error', errors });
    }

    await crudService.update(tabla, req.params.id, req.body);
    res.json({ status: 'success', message: `${tabla} actualizado` });
  } catch (error) {
    next(error);
  }
};

const remove = (tabla) => async (req, res, next) => {
  try {
    await crudService.remove(tabla, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, update, remove };
