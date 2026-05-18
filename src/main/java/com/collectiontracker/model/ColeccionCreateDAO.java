package com.collectiontracker.model;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ColeccionCreateDAO {
    public Coleccion createCollection(int ideUsu, String nomCol, String icono, boolean publica, String imagenUrl) {
        Coleccion col = null;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO colecciones (ide_usu, nom_col, icono, publica, imagen_url) VALUES (?, ?, ?, ?, ?)",
                PreparedStatement.RETURN_GENERATED_KEYS
            );
            stmt.setInt(1, ideUsu);
            stmt.setString(2, nomCol);
            stmt.setString(3, icono);
            stmt.setBoolean(4, publica);
            stmt.setString(5, imagenUrl);
            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                col = new Coleccion();
                col.setIdeCol(rs.getInt(1));
                col.setNomCol(nomCol);
                col.setIcono(icono);
                col.setPublica(publica);
                col.setTotalItems(0);
                col.setConseguidos(0);
                col.setDeseados(0);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return col;
    }
}
