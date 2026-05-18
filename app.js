require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(loggerMiddleware);

// rutas
app.use('/', require('./routes/api_routes'));

// manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
