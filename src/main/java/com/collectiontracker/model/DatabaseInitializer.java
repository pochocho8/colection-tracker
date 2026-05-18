package com.collectiontracker.model;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.sql.Connection;
import java.sql.Statement;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try (Connection conn = ConexionBD.getConnection(); Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS usuarios ("
                    + "ide_usu INT NOT NULL AUTO_INCREMENT,"
                    + "nom_usu VARCHAR(100) NOT NULL UNIQUE,"
                    + "email_usu VARCHAR(150) NOT NULL UNIQUE,"
                    + "pass_usu VARCHAR(255) NOT NULL,"
                    + "baneado TINYINT(1) DEFAULT 0,"
                    + "fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
                    + "PRIMARY KEY (ide_usu))");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS colecciones ("
                    + "ide_col INT NOT NULL AUTO_INCREMENT,"
                    + "ide_usu INT NOT NULL,"
                    + "nom_col VARCHAR(150) NOT NULL,"
                    + "icono VARCHAR(50) DEFAULT 'collection',"
                    + "publica TINYINT(1) DEFAULT 0,"
                    + "imagen_url MEDIUMTEXT DEFAULT NULL,"
                    + "PRIMARY KEY (ide_col),"
                    + "FOREIGN KEY (ide_usu) REFERENCES usuarios(ide_usu) ON DELETE CASCADE)");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS colecciones_descargas ("
                    + "ide_descarga INT NOT NULL AUTO_INCREMENT,"
                    + "ide_usu INT NOT NULL,"
                    + "ide_col_original INT NOT NULL,"
                    + "ide_col_copia INT NOT NULL,"
                    + "fecha_descarga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
                    + "PRIMARY KEY (ide_descarga),"
                    + "FOREIGN KEY (ide_usu) REFERENCES usuarios(ide_usu) ON DELETE CASCADE,"
                    + "FOREIGN KEY (ide_col_original) REFERENCES colecciones(ide_col) ON DELETE CASCADE,"
                    + "FOREIGN KEY (ide_col_copia) REFERENCES colecciones(ide_col) ON DELETE CASCADE,"
                    + "UNIQUE KEY unique_descarga (ide_usu, ide_col_original))");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS items ("
                    + "ide_item INT NOT NULL AUTO_INCREMENT,"
                    + "ide_col INT NOT NULL,"
                    + "nom_item VARCHAR(150) NOT NULL,"
                    + "estado ENUM('ninguno', 'conseguido', 'deseado') DEFAULT 'ninguno',"
                    + "imagen_url MEDIUMTEXT DEFAULT NULL,"
                    + "observaciones TEXT DEFAULT NULL,"
                    + "fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
                    + "PRIMARY KEY (ide_item),"
                    + "FOREIGN KEY (ide_col) REFERENCES colecciones(ide_col) ON DELETE CASCADE)");

            sce.getServletContext().log("Database schema initialized successfully");
        } catch (Exception e) {
            sce.getServletContext().log("Database initialization error: " + e.getMessage(), e);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
