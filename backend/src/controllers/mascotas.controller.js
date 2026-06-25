const path = require('path');
const fs = require('fs');
const db = require('../../config/db');
const crudService = require('../services/crud.service');

// sube/reemplaza la foto de una mascota.
// multer ya guardo el archivo en disco antes de llegar aqui (ver routes),
// req.file contiene los datos del archivo subido.
const subirFoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No se recibio ninguna imagen' });
    }

    const { id } = req.params;

    // verificamos que la mascota exista antes de asociarle la foto
    const [results] = await db.query('SELECT * FROM mascotas WHERE id = ?', [id]);
    if (results.length === 0) {
      // si la mascota no existe, borramos el archivo que multer ya guardo
      // para no dejar imagenes huerfanas en el disco
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ status: 'error', message: 'Mascota no encontrada' });
    }

    const mascota = results[0];

    // construimos la URL publica con la que el frontend podra mostrar la imagen
    // (la carpeta /public/uploads ya se sirve como estatica desde app.js)
    const fotoUrl = `/uploads/mascotas/${req.file.filename}`;

    // si la mascota ya tenia una foto anterior subida por este mismo sistema,
    // la borramos del disco para no acumular archivos sin uso
    if (mascota.foto && mascota.foto.startsWith('/uploads/mascotas/')) {
      const fotoAnteriorPath = path.join(__dirname, '..', '..', 'public', mascota.foto);
      fs.unlink(fotoAnteriorPath, () => {}); // si falla (ej. ya no existe), lo ignoramos
    }

    await crudService.update('mascotas', id, { foto: fotoUrl });

    res.json({ status: 'success', message: 'Foto actualizada', foto: fotoUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = { subirFoto };
