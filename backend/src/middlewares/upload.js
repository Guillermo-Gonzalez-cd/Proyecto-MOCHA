const path = require('path');
const fs = require('fs');
const multer = require('multer');

// carpeta donde se guardan las fotos de mascotas
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'mascotas');

// se asegura de que la carpeta exista (por si se borró o es un clon nuevo)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// configuracion de almacenamiento: nombre unico por archivo para evitar
// que una mascota sobreescriba la foto de otra
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sufijo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `mascota-${sufijo}${extension}`);
  },
});

// solo se aceptan imagenes (jpg, png, webp, gif)
const tiposPermitidos = /jpeg|jpg|png|webp|gif/;

function filtroArchivo(req, file, cb) {
  const extensionValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeValido = tiposPermitidos.test(file.mimetype);

  if (extensionValida && mimeValido) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten imagenes (jpg, png, webp o gif)'));
}

const upload = multer({
  storage,
  fileFilter: filtroArchivo,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximo por foto
});

module.exports = upload;
