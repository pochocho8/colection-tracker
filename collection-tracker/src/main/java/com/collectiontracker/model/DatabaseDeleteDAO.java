package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class DatabaseDeleteDAO {
    public boolean deleteAllUserData(int ideUsu) {
        boolean result = false;
        Connection conn = null;
        try {
            conn = ConexionBD.getConnection();
            conn.setAutoCommit(false);
            
            PreparedStatement stmt1 = conn.prepareStatement(
                "DELETE FROM items WHERE ide_col IN (SELECT ide_col FROM colecciones WHERE ide_usu = ?)"
            );
            stmt1.setInt(1, ideUsu);
            stmt1.executeUpdate();
            
            PreparedStatement stmt2 = conn.prepareStatement(
                "DELETE FROM colecciones WHERE ide_usu = ?"
            );
            stmt2.setInt(1, ideUsu);
            stmt2.executeUpdate();
            
            conn.commit();
            result = true;
        } catch (Exception e) {
            try { if (conn != null) conn.rollback(); } catch (Exception ignored) {}
            throw new RuntimeException(e);
        } finally {
            try { if (conn != null) { conn.setAutoCommit(true); conn.close(); } } catch (Exception ignored) {}
        }
        return result;
    }
}
