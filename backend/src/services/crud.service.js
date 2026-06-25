const db = require('../../config/db');

// inserta un registro en la tabla indicada
const create = async (tabla, data) => {
  const [result] = await db.query(`INSERT INTO ${tabla} SET ?`, data);
  return { id: result.insertId };
};

// obtiene todos los registros de la tabla
const getAll = async (tabla) => {
  const [results] = await db.query(`SELECT * FROM ${tabla}`);
  return results;
};

// obtiene un registro por id
const getById = async (tabla, id) => {
  const [results] = await db.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
  if (results.length === 0) {
    const error = new Error('No encontrado');
    error.statusCode = 404;
    throw error;
  }
  return results[0];
};

// actualiza un registro por id
const update = async (tabla, id, data) => {
  await db.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id]);
};

// elimina un registro por id
const remove = async (tabla, id) => {
  await db.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
};

module.exports = { create, getAll, getById, update, remove };
