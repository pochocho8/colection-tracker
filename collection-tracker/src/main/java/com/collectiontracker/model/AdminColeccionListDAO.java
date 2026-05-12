package com.collectiontracker.model;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class AdminColeccionListDAO {
    
    public List<Coleccion> getAllPublicCollections() {
        List<Coleccion> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT c.ide_col, c.nom_col, c.icono, c.publica, c.ide_usu, u.nom_usu as owner_name, " +
                "COUNT(i.ide_item) as total_items, " +
                "SUM(CASE WHEN i.estado = 'conseguido' THEN 1 ELSE 0 END) as conseguidos, " +
                "SUM(CASE WHEN i.estado = 'deseado' THEN 1 ELSE 0 END) as deseados " +
                "FROM colecciones c " +
                "LEFT JOIN items i ON c.ide_col = i.ide_col " +
                "LEFT JOIN usuarios u ON c.ide_usu = u.ide_usu " +
                "WHERE c.publica = 1 " +
                "GROUP BY c.ide_col, c.nom_col, c.icono, c.publica, c.ide_usu, u.nom_usu " +
                "ORDER BY c.ide_col DESC"
            );
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Coleccion col = new Coleccion();
                col.setIdeCol(rs.getInt("ide_col"));
                col.setNomCol(rs.getString("nom_col"));
                col.setIcono(rs.getString("icono"));
                col.setPublica(rs.getBoolean("publica"));
                col.setIdeUsu(rs.getInt("ide_usu"));
                col.setOwnerName(rs.getString("owner_name"));
                col.setTotalItems(rs.getInt("total_items"));
                col.setConseguidos(rs.getInt("conseguidos"));
                col.setDeseados(rs.getInt("deseados"));
                list.add(col);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return list;
    }
    
    public Coleccion getCollectionById(int ideCol) {
        Coleccion col = null;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT c.ide_col, c.nom_col, c.icono, c.publica, c.ide_usu, u.nom_usu as owner_name " +
                "FROM colecciones c " +
                "LEFT JOIN usuarios u ON c.ide_usu = u.ide_usu " +
                "WHERE c.ide_col = ?"
            );
            stmt.setInt(1, ideCol);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                col = new Coleccion();
                col.setIdeCol(rs.getInt("ide_col"));
                col.setNomCol(rs.getString("nom_col"));
                col.setIcono(rs.getString("icono"));
                col.setPublica(rs.getBoolean("publica"));
                col.setIdeUsu(rs.getInt("ide_usu"));
                col.setOwnerName(rs.getString("owner_name"));
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return col;
    }
}