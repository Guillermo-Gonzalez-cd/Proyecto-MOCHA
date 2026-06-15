// maneja todos los errores de la aplicacion de forma centralizada
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Ocurrio un error inesperado';

  console.error(`[${new Date().toISOString()}] Error ${statusCode}: ${message}`);

  if (error.stack) {
    console.error(error.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // solo muestra el stack en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
