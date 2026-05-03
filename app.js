require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// rutas
app.use('/', require('./routes/api_routes'));

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});