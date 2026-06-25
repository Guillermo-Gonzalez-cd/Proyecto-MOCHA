CREATE DATABASE IF NOT EXISTS mascotas_db;
USE mascotas_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50),
  raza VARCHAR(50),
  sexo VARCHAR(20),
  peso FLOAT,
  edad INT,
  color VARCHAR(50),
  foto VARCHAR(255),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE medicamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  nombre VARCHAR(100) NOT NULL,
  dosis VARCHAR(50),
  fecha_inicio DATE,
  fecha_fin DATE,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE historial_medico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  diagnostico TEXT,
  tratamiento TEXT,
  fecha DATE,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE vacunas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE recordatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  tipo VARCHAR(50),
  fecha DATE,
  notificado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE alimentacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  peso FLOAT,
  edad INT,
  cantidad_diaria FLOAT,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE ciclo_reproductivo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  prediccion DATE,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

-- bloques de tiempo disponibles para citas (solo el admin los crea)
CREATE TABLE bloques_tiempo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  disponible BOOLEAN DEFAULT TRUE
);

-- citas medicas de mascotas vinculadas a un bloque de tiempo
CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT NOT NULL,
  bloque_tiempo_id INT NOT NULL,
  motivo VARCHAR(255),
  estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id),
  FOREIGN KEY (bloque_tiempo_id) REFERENCES bloques_tiempo(id)
);


DELETE FROM medicamentos;
DELETE FROM historial_medico;
DELETE FROM vacunas;
DELETE FROM recordatorios;
DELETE FROM alimentacion;
DELETE FROM ciclo_reproductivo;
DELETE FROM citas;
DELETE FROM mascotas;
DROP TABLE mascotas;