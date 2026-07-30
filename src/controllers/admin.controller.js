const adminService = require('../services/admin.service');

// crea un bloque de tiempo (solo admin)
const createTimeBlock = async (req, res, next) => {
  try {
    const timeBlock = await adminService.createTimeBlock(req.body);
    res.status(201).json({ status: 'success', data: timeBlock });
  } catch (error) {
    next(error);
  }
};

// lista todos los bloques de tiempo (solo admin)
const listTimeBlocks = async (req, res, next) => {
  try {
    const blocks = await adminService.listTimeBlocks();
    res.json({ status: 'success', data: blocks });
  } catch (error) {
    next(error);
  }
};

// lista todas las citas del sistema (solo admin)
const listAllCitas = async (req, res, next) => {
  try {
    const citas = await adminService.listAllCitas();
    res.json({ status: 'success', data: citas });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTimeBlock, listTimeBlocks, listAllCitas };
