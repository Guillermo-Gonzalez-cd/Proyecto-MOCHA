require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(loggerMiddleware);

// rutas de la API
app.use('/', routes);

// si existe el build del frontend (frontend/dist), lo servimos también.
// Así el backend puede entregar la app React completa desde una sola URL.
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // cualquier ruta que no sea de la API devuelve el index.html del frontend
  // (necesario para que el enrutamiento del lado del cliente funcione)
  app.get('/*any', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
