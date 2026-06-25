const db = require('../../config/db');

// crea una nueva cita verificando que no haya conflicto de horario
const createCita = async ({ mascota_id, bloque_tiempo_id, motivo }) => {
  if (!mascota_id || !bloque_tiempo_id) {
    const error = new Error('mascota_id y bloque_tiempo_id son requeridos');
    error.statusCode = 400;
    throw error;
  }

  // verificar que el bloque existe y esta disponible
  const [bloques] = await db.query(
    'SELECT * FROM bloques_tiempo WHERE id = ? AND disponible = TRUE',
    [bloque_tiempo_id]
  );
  if (bloques.length === 0) {
    const error = new Error('El bloque de tiempo no existe o ya esta ocupado');
    error.statusCode = 409;
    throw error;
  }

  // verificar que la mascota no tenga ya una cita en ese bloque
  const [conflicto] = await db.query(
    'SELECT id FROM citas WHERE bloque_tiempo_id = ? AND estado != ?',
    [bloque_tiempo_id, 'cancelada']
  );
  if (conflicto.length > 0) {
    const error = new Error('El horario solicitado ya esta ocupado');
    error.statusCode = 409;
    throw error;
  }

  const [result] = await db.query(
    'INSERT INTO citas SET ?',
    { mascota_id, bloque_tiempo_id, motivo: motivo || null, estado: 'pendiente' }
  );

  // marcar el bloque como no disponible
  await db.query('UPDATE bloques_tiempo SET disponible = FALSE WHERE id = ?', [bloque_tiempo_id]);

  return { id: result.insertId, mascota_id, bloque_tiempo_id, estado: 'pendiente' };
};

// obtiene todas las citas de una mascota
const getCitasByMascota = async (mascota_id) => {
  const [results] = await db.query(`
    SELECT 
      c.id,
      c.motivo,
      c.estado,
      c.fecha_creacion,
      bt.fecha,
      bt.hora_inicio,
      bt.hora_fin
    FROM citas c
    JOIN bloques_tiempo bt ON c.bloque_tiempo_id = bt.id
    WHERE c.mascota_id = ?
    ORDER BY bt.fecha, bt.hora_inicio
  `, [mascota_id]);
  return results;
};

// obtiene una cita por id
const getCitaById = async (id) => {
  const [results] = await db.query(`
    SELECT 
      c.id,
      c.motivo,
      c.estado,
      c.fecha_creacion,
      m.nombre AS mascota,
      bt.fecha,
      bt.hora_inicio,
      bt.hora_fin
    FROM citas c
    JOIN mascotas m ON c.mascota_id = m.id
    JOIN bloques_tiempo bt ON c.bloque_tiempo_id = bt.id
    WHERE c.id = ?
  `, [id]);

  if (results.length === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }
  return results[0];
};

// actualiza el motivo o estado de una cita
const updateCita = async (id, { motivo, estado }) => {
  const [existing] = await db.query('SELECT id FROM citas WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }

  await db.query('UPDATE citas SET ? WHERE id = ?', [{ motivo, estado }, id]);

  // si se cancela, liberar el bloque de tiempo
  if (estado === 'cancelada') {
    const [cita] = await db.query('SELECT bloque_tiempo_id FROM citas WHERE id = ?', [id]);
    await db.query('UPDATE bloques_tiempo SET disponible = TRUE WHERE id = ?', [cita[0].bloque_tiempo_id]);
  }

  return { id, motivo, estado };
};

// elimina una cita y libera el bloque
const deleteCita = async (id) => {
  const [existing] = await db.query('SELECT * FROM citas WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }

  // liberar el bloque de tiempo
  await db.query('UPDATE bloques_tiempo SET disponible = TRUE WHERE id = ?', [existing[0].bloque_tiempo_id]);
  await db.query('DELETE FROM citas WHERE id = ?', [id]);
};

module.exports = { createCita, getCitasByMascota, getCitaById, updateCita, deleteCita };
