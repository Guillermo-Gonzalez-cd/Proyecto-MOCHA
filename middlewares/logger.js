// registra cada solicitud que llega a la API
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = loggerMiddleware;
