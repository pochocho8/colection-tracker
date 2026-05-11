package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class ItemDeleteDAO {
    public boolean deleteItem(int ideItem, int ideUsu) {
        boolean result = false;
        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "DELETE i FROM items i JOIN colecciones c ON i.ide_col = c.ide_col WHERE i.ide_item = ? AND c.ide_usu = ?"
             )) {
            stmt.setInt(1, ideItem);
            stmt.setInt(2, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
