CREATE DATABASE IF NOT EXISTS collection_db;
USE collection_db;

CREATE TABLE IF NOT EXISTS usuarios (
    ide_usu INT NOT NULL AUTO_INCREMENT,
    nom_usu VARCHAR(100) NOT NULL UNIQUE,
    email_usu VARCHAR(150) NOT NULL UNIQUE,
    pass_usu VARCHAR(255) NOT NULL,
    baneado TINYINT(1) DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ide_usu)
);

CREATE TABLE IF NOT EXISTS colecciones (
    ide_col INT NOT NULL AUTO_INCREMENT,
    ide_usu INT NOT NULL,
    nom_col VARCHAR(150) NOT NULL,
    icono VARCHAR(50) DEFAULT 'collection',
    publica TINYINT(1) DEFAULT 0,
    PRIMARY KEY (ide_col),
    FOREIGN KEY (ide_usu) REFERENCES usuarios(ide_usu) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS colecciones_descargas (
    ide_descarga INT NOT NULL AUTO_INCREMENT,
    ide_usu INT NOT NULL,
    ide_col_original INT NOT NULL,
    ide_col_copia INT NOT NULL,
    fecha_descarga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ide_descarga),
    FOREIGN KEY (ide_usu) REFERENCES usuarios(ide_usu) ON DELETE CASCADE,
    FOREIGN KEY (ide_col_original) REFERENCES colecciones(ide_col) ON DELETE CASCADE,
    FOREIGN KEY (ide_col_copia) REFERENCES colecciones(ide_col) ON DELETE CASCADE,
    UNIQUE KEY unique_descarga (ide_usu, ide_col_original)
);

CREATE TABLE IF NOT EXISTS items (
    ide_item INT NOT NULL AUTO_INCREMENT,
    ide_col INT NOT NULL,
    nom_item VARCHAR(150) NOT NULL,
    estado ENUM('ninguno', 'conseguido', 'deseado') DEFAULT 'ninguno',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ide_item),
    FOREIGN KEY (ide_col) REFERENCES colecciones(ide_col) ON DELETE CASCADE
);

DROP PROCEDURE IF EXISTS add_publica_column;
DELIMITER //
CREATE PROCEDURE add_publica_column()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'collection_db' AND TABLE_NAME = 'colecciones' AND COLUMN_NAME = 'publica'
    ) THEN
        ALTER TABLE colecciones ADD COLUMN publica TINYINT(1) DEFAULT 0;
    END IF;
END //
DELIMITER ;
CALL add_publica_column();
DROP PROCEDURE IF EXISTS add_publica_column;

DROP PROCEDURE IF EXISTS add_baneado_column;
DELIMITER //
CREATE PROCEDURE add_baneado_column()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'collection_db' AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'baneado'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN baneado TINYINT(1) DEFAULT 0;
    END IF;
END //
DELIMITER ;
CALL add_baneado_column();
DROP PROCEDURE IF EXISTS add_baneado_column;




