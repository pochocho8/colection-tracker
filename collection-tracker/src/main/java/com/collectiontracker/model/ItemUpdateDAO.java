package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class ItemUpdateDAO {
    public boolean updateItem(int ideItem, String estado, int ideUsu) {
        boolean result = false;
        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "UPDATE items i JOIN colecciones c ON i.ide_col = c.ide_col SET i.estado = ? WHERE i.ide_item = ? AND c.ide_usu = ?"
             )) {
            stmt.setString(1, estado);
            stmt.setInt(2, ideItem);
            stmt.setInt(3, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
