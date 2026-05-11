package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class ColeccionDeleteDAO {
    public boolean deleteCollection(int ideCol, int ideUsu) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "DELETE FROM colecciones WHERE ide_col = ? AND ide_usu = ?"
            );
            stmt.setInt(1, ideCol);
            stmt.setInt(2, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
