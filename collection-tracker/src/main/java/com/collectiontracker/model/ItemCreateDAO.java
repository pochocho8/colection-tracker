package com.collectiontracker.model;

import com.collectiontracker.model.Item;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ItemCreateDAO {
    public Item createItem(int ideCol, String nomItem, String estado) {
        Item item = null;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO items (ide_col, nom_item, estado) VALUES (?, ?, ?)",
                PreparedStatement.RETURN_GENERATED_KEYS
            );
            stmt.setInt(1, ideCol);
            stmt.setString(2, nomItem);
            stmt.setString(3, estado);
            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                item = new Item();
                item.setIdeItem(rs.getInt(1));
                item.setIdeCol(ideCol);
                item.setNomItem(nomItem);
                item.setEstado(estado);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return item;
    }
}
