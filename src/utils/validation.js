// valida formato de correo
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// valida que un campo de texto tenga minimo cierta longitud
function isValidText(value, min = 2) {
  return typeof value === 'string' && value.trim().length >= min;
}

// valida que un numero sea positivo
function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) > 0;
}

// valida formato de fecha YYYY-MM-DD
function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// validaciones por tabla
const validators = {
  users: (body) => {
    const errors = [];
    if (!isValidText(body.nombre, 3)) errors.push('El nombre debe tener al menos 3 caracteres');
    if (!body.correo || !isValidEmail(body.correo)) errors.push('El correo no es valido');
    if (!body.password || body.password.length < 6) errors.push('La password debe tener al menos 6 caracteres');
    return errors;
  },

  mascotas: (body) => {
    const errors = [];
    if (!isValidText(body.nombre, 2)) errors.push('El nombre debe tener al menos 2 caracteres');
    if (!isValidText(body.especie, 2)) errors.push('La especie es requerida');
    if (body.peso && !isPositiveNumber(body.peso)) errors.push('El peso debe ser un numero positivo');
    if (body.edad && !isPositiveNumber(body.edad)) errors.push('La edad debe ser un numero positivo');
    return errors;
  },

  medicamentos: (body) => {
    const errors = [];
    if (!isValidText(body.nombre, 2)) errors.push('El nombre del medicamento es requerido');
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (body.fecha_inicio && !isValidDate(body.fecha_inicio)) errors.push('fecha_inicio debe tener formato YYYY-MM-DD');
    if (body.fecha_fin && !isValidDate(body.fecha_fin)) errors.push('fecha_fin debe tener formato YYYY-MM-DD');
    return errors;
  },

  historial_medico: (body) => {
    const errors = [];
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (!isValidText(body.diagnostico, 3)) errors.push('El diagnostico es requerido');
    if (body.fecha && !isValidDate(body.fecha)) errors.push('La fecha debe tener formato YYYY-MM-DD');
    return errors;
  },

  vacunas: (body) => {
    const errors = [];
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (!isValidText(body.nombre, 2)) errors.push('El nombre de la vacuna es requerido');
    if (body.fecha && !isValidDate(body.fecha)) errors.push('La fecha debe tener formato YYYY-MM-DD');
    return errors;
  },

  recordatorios: (body) => {
    const errors = [];
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (!isValidText(body.tipo, 2)) errors.push('El tipo de recordatorio es requerido');
    if (body.fecha && !isValidDate(body.fecha)) errors.push('La fecha debe tener formato YYYY-MM-DD');
    return errors;
  },

  alimentacion: (body) => {
    const errors = [];
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (body.peso && !isPositiveNumber(body.peso)) errors.push('El peso debe ser un numero positivo');
    if (body.edad && !isPositiveNumber(body.edad)) errors.push('La edad debe ser un numero positivo');
    if (body.cantidad_diaria && !isPositiveNumber(body.cantidad_diaria)) errors.push('La cantidad diaria debe ser un numero positivo');
    return errors;
  },

  ciclo_reproductivo: (body) => {
    const errors = [];
    if (!body.mascota_id) errors.push('El mascota_id es requerido');
    if (body.fecha_inicio && !isValidDate(body.fecha_inicio)) errors.push('fecha_inicio debe tener formato YYYY-MM-DD');
    if (body.fecha_fin && !isValidDate(body.fecha_fin)) errors.push('fecha_fin debe tener formato YYYY-MM-DD');
    if (body.prediccion && !isValidDate(body.prediccion)) errors.push('prediccion debe tener formato YYYY-MM-DD');
    return errors;
  }
};

// funcion principal que valida segun la tabla
function validate(tabla, body) {
  const validator = validators[tabla];
  if (!validator) return [];
  const errors = validator(body);
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validate };
