const db = require('../../config/db');

// crea un bloque de tiempo disponible para citas
const createTimeBlock = async ({ fecha, hora_inicio, hora_fin }) => {
  if (!fecha || !hora_inicio || !hora_fin) {
    const error = new Error('fecha, hora_inicio y hora_fin son requeridos');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await db.query(
    'INSERT INTO bloques_tiempo SET ?',
    { fecha, hora_inicio, hora_fin, disponible: true }
  );

  return { id: result.insertId, fecha, hora_inicio, hora_fin };
};

// lista todos los bloques de tiempo
const listTimeBlocks = async () => {
  const [results] = await db.query('SELECT * FROM bloques_tiempo ORDER BY fecha, hora_inicio');
  return results;
};

// lista todas las citas con info de mascota y bloque de tiempo
const listAllCitas = async () => {
  const [results] = await db.query(`
    SELECT 
      c.id,
      c.motivo,
      c.estado,
      c.fecha_creacion,
      m.nombre AS mascota,
      m.especie,
      bt.fecha,
      bt.hora_inicio,
      bt.hora_fin
    FROM citas c
    JOIN mascotas m ON c.mascota_id = m.id
    JOIN bloques_tiempo bt ON c.bloque_tiempo_id = bt.id
    ORDER BY bt.fecha, bt.hora_inicio
  `);
  return results;
};

module.exports = { createTimeBlock, listTimeBlocks, listAllCitas };
