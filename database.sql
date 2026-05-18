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
