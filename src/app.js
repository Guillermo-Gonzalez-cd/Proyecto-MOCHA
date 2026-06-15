require('dotenv').config();
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

// rutas
app.use('/', routes);

// manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
