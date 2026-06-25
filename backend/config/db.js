require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mascotas_db'
});

// verifica que la conexion funcione al iniciar
async function connectDB() {
  try {
    const connection = await db.getConnection();
    console.log('MySQL conectado y funcionando');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con MySQL:', error.message);
    process.exit(1);
  }
}

connectDB();

module.exports = db;
