package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class ColeccionUpdateDAO {
    public boolean updateCollection(int ideCol, int ideUsu, String nomCol, String icono, boolean publica) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "UPDATE colecciones SET nom_col = ?, icono = ?, publica = ? WHERE ide_col = ? AND ide_usu = ?"
            );
            stmt.setString(1, nomCol);
            stmt.setString(2, icono);
            stmt.setBoolean(3, publica);
            stmt.setInt(4, ideCol);
            stmt.setInt(5, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public boolean updateCollectionImage(int ideCol, int ideUsu, String imagenUrl) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "UPDATE colecciones SET imagen_url = ? WHERE ide_col = ? AND ide_usu = ?"
            );
            stmt.setString(1, imagenUrl);
            stmt.setInt(2, ideCol);
            stmt.setInt(3, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
