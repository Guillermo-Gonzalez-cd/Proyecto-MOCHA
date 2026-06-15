const citasService = require('../services/citas.service');

// crea una nueva cita
const createCita = async (req, res, next) => {
  try {
    const cita = await citasService.createCita(req.body);
    res.status(201).json({ status: 'success', data: cita });
  } catch (error) {
    next(error);
  }
};

// obtiene las citas de una mascota por su id
const getCitasByMascota = async (req, res, next) => {
  try {
    const citas = await citasService.getCitasByMascota(req.params.mascota_id);
    res.json({ status: 'success', data: citas });
  } catch (error) {
    next(error);
  }
};

// obtiene una cita por id
const getCitaById = async (req, res, next) => {
  try {
    const cita = await citasService.getCitaById(req.params.id);
    res.json({ status: 'success', data: cita });
  } catch (error) {
    next(error);
  }
};

// actualiza una cita
const updateCita = async (req, res, next) => {
  try {
    const cita = await citasService.updateCita(req.params.id, req.body);
    res.json({ status: 'success', data: cita });
  } catch (error) {
    next(error);
  }
};

// elimina una cita
const deleteCita = async (req, res, next) => {
  try {
    await citasService.deleteCita(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { createCita, getCitasByMascota, getCitaById, updateCita, deleteCita };
