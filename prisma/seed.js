// seed.js - pobla la base de datos con datos de prueba
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    // usuarios de demostracion
    const users = [
      { nombre: 'Admin Principal', correo: 'admin@mascotas.com',    password: 'admin123', rol: 'admin', telefono: '88001100' },
      { nombre: 'Usuario 1',       correo: 'usuario1@ejemplo.com',  password: 'pass123',  rol: 'user',  telefono: '88001101' },
      { nombre: 'Usuario 2',       correo: 'usuario2@ejemplo.com',  password: 'pass123',  rol: 'user',  telefono: '88001102' },
    ];

    console.log('Creando usuarios de demostracion...');
    for (const user of users) {
      // verificar si ya existe para no duplicar
      const [existing] = await db.query('SELECT id FROM users WHERE correo = ?', [user.correo]);
      if (existing.length > 0) {
        console.log(`  - ${user.correo} ya existe, omitiendo`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query('INSERT INTO users SET ?', {
        nombre: user.nombre,
        correo: user.correo,
        password: hashedPassword,
        rol: user.rol,
        telefono: user.telefono
      });
      console.log(`  - ${user.correo} creado`);
    }

    // mascota de demostracion vinculada al primer usuario
    const [userRows] = await db.query('SELECT id FROM users LIMIT 1');
    if (userRows.length > 0) {
      const userId = userRows[0].id;

      const [existingMascota] = await db.query('SELECT id FROM mascotas WHERE nombre = ? AND user_id = ?', ['Luna', userId]);
      if (existingMascota.length === 0) {
        await db.query('INSERT INTO mascotas SET ?', {
          nombre: 'Luna',
          especie: 'Perro',
          raza: 'Labrador',
          sexo: 'Hembra',
          peso: 12.5,
          edad: 3,
          user_id: userId
        });
        console.log('  - Mascota Luna creada');
      } else {
        console.log('  - Mascota Luna ya existe, omitiendo');
      }
    }

    console.log('Seed completado con exito');
  } catch (error) {
    console.error('Error en seed:', error.message);
  } finally {
    await db.end();
  }
}

main();
