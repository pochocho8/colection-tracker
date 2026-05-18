package com.collectiontracker.model;

import com.collectiontracker.model.Item;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ItemListDAO {
    public List<Item> getItemsByCollection(int ideCol, int ideUsu) {
        List<Item> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT i.ide_item, i.ide_col, i.nom_item, i.estado, i.imagen_url, i.observaciones " +
                "FROM items i " +
                "INNER JOIN colecciones c ON i.ide_col = c.ide_col " +
                "WHERE i.ide_col = ? AND c.ide_usu = ? " +
                "ORDER BY i.ide_item ASC"
            );
            stmt.setInt(1, ideCol);
            stmt.setInt(2, ideUsu);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Item item = new Item();
                item.setIdeItem(rs.getInt("ide_item"));
                item.setIdeCol(rs.getInt("ide_col"));
                item.setNomItem(rs.getString("nom_item"));
                item.setEstado(rs.getString("estado"));
                item.setImagenUrl(rs.getString("imagen_url"));
                item.setObservaciones(rs.getString("observaciones"));
                list.add(item);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return list;
    }
    
    public List<Item> getItemsByCollectionPublic(int ideCol) {
        List<Item> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT i.ide_item, i.ide_col, i.nom_item, i.estado, i.imagen_url, i.observaciones " +
                "FROM items i " +
                "INNER JOIN colecciones c ON i.ide_col = c.ide_col " +
                "WHERE i.ide_col = ? AND c.publica = 1 " +
                "ORDER BY i.ide_item ASC"
            );
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Item item = new Item();
                item.setIdeItem(rs.getInt("ide_item"));
                item.setIdeCol(rs.getInt("ide_col"));
                item.setNomItem(rs.getString("nom_item"));
                item.setEstado(rs.getString("estado"));
                item.setImagenUrl(rs.getString("imagen_url"));
                item.setObservaciones(rs.getString("observaciones"));
                list.add(item);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return list;
    }
}
