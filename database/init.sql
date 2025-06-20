-- Base de datos
CREATE DATABASE IF NOT EXISTS tienda_mate;
USE tienda_mate;

-- Contactos
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'respondido', 'cerrado') DEFAULT 'pendiente'
);

-- Trabajos
CREATE TABLE IF NOT EXISTS solicitudes_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    puesto VARCHAR(150) NOT NULL,
    mensaje TEXT,
    cv_path VARCHAR(255),
    cv_filename VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('recibida', 'en_revision', 'entrevista', 'rechazada', 'contratada') DEFAULT 'recibida'
);

-- Agregar columnas para archivos CV
SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE solicitudes_trabajo ADD COLUMN cv_path VARCHAR(255) AFTER mensaje;',
    'SELECT "cv_path column already exists";'
  )
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'solicitudes_trabajo'
    AND column_name = 'cv_path'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql2 = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE solicitudes_trabajo ADD COLUMN cv_filename VARCHAR(255) AFTER cv_path;',
    'SELECT "cv_filename column already exists";'
  )
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'solicitudes_trabajo'
    AND column_name = 'cv_filename'
);

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;


-- Franquicias
CREATE TABLE IF NOT EXISTS solicitudes_franquicias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    como_llegaste VARCHAR(200),
    zona VARCHAR(200) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('nueva', 'en_evaluacion', 'aprobada', 'rechazada') DEFAULT 'nueva'
);

-- Tabla para newsletter
CREATE TABLE IF NOT EXISTS newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar algunos datos de ejemplo para testing
INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES 
('Juan Pérez', 'juan@example.com', 'Consulta sobre productos', 'Hola, me gustaría saber más sobre sus mates artesanales.'),
('María García', 'maria@example.com', 'Información de tiendas', '¿Tienen sucursal en mi ciudad?');

INSERT INTO newsletter (email) VALUES 
('test@example.com'),
('demo@example.com');

-- Mostrar que las tablas fueron creadas
SHOW TABLES;