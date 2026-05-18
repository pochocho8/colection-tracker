package com.collectiontracker.model;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ColeccionGetDAO {
    public Coleccion getCollection(int ideCol, int ideUsu) {
        Coleccion col = null;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT c.ide_col, c.nom_col, c.icono, c.publica, c.ide_usu, MAX(c.imagen_url) as imagen_url, " +
                "COUNT(i.ide_item) as total_items, " +
                "SUM(CASE WHEN i.estado = 'conseguido' THEN 1 ELSE 0 END) as conseguidos, " +
                "SUM(CASE WHEN i.estado = 'deseado' THEN 1 ELSE 0 END) as deseados " +
                "FROM colecciones c " +
                "LEFT JOIN items i ON c.ide_col = i.ide_col " +
                "WHERE c.ide_col = ? AND c.ide_usu = ? " +
                "GROUP BY c.ide_col, c.nom_col, c.icono, c.publica, c.ide_usu"
            );
            stmt.setInt(1, ideCol);
            stmt.setInt(2, ideUsu);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                col = new Coleccion();
                col.setIdeCol(rs.getInt("ide_col"));
                col.setNomCol(rs.getString("nom_col"));
                col.setIcono(rs.getString("icono"));
                col.setPublica(rs.getBoolean("publica"));
                col.setImagenUrl(rs.getString("imagen_url"));
                col.setTotalItems(rs.getInt("total_items"));
                col.setConseguidos(rs.getInt("conseguidos"));
                col.setDeseados(rs.getInt("deseados"));
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return col;
    }

    public boolean isOwner(int ideCol, int ideUsu) {
        boolean isOwner = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT 1 FROM colecciones WHERE ide_col = ? AND ide_usu = ?"
            );
            stmt.setInt(1, ideCol);
            stmt.setInt(2, ideUsu);
            ResultSet rs = stmt.executeQuery();
            isOwner = rs.next();
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return isOwner;
    }
}
