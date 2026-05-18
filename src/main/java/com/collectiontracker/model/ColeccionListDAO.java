package com.collectiontracker.model;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ColeccionListDAO {
    public List<Coleccion> getCollectionsByUser(int ideUsu) {
        List<Coleccion> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT c.ide_col, c.nom_col, c.icono, c.publica, MAX(c.imagen_url) as imagen_url, " +
                "COUNT(i.ide_item) as total_items, " +
                "SUM(CASE WHEN i.estado = 'conseguido' THEN 1 ELSE 0 END) as conseguidos, " +
                "SUM(CASE WHEN i.estado = 'deseado' THEN 1 ELSE 0 END) as deseados " +
                "FROM colecciones c " +
                "LEFT JOIN items i ON c.ide_col = i.ide_col " +
                "WHERE c.ide_usu = ? " +
                "GROUP BY c.ide_col, c.nom_col, c.icono, c.publica " +
                "ORDER BY c.ide_col ASC"
            );
            stmt.setInt(1, ideUsu);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Coleccion col = new Coleccion();
                col.setIdeCol(rs.getInt("ide_col"));
                col.setNomCol(rs.getString("nom_col"));
                col.setIcono(rs.getString("icono"));
                col.setPublica(rs.getBoolean("publica"));
                col.setImagenUrl(rs.getString("imagen_url"));
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

    public List<Coleccion> getPublicCollections() {
        return getPublicCollections(-1);
    }

    public List<Coleccion> getPublicCollections(int ideUsu) {
        List<Coleccion> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT c.ide_col, c.nom_col, c.icono, c.publica, MAX(c.imagen_url) as imagen_url, u.nom_usu as owner_name, " +
                "COUNT(i.ide_item) as total_items, " +
                "SUM(CASE WHEN i.estado = 'conseguido' THEN 1 ELSE 0 END) as conseguidos, " +
                "SUM(CASE WHEN i.estado = 'deseado' THEN 1 ELSE 0 END) as deseados " +
                "FROM colecciones c " +
                "LEFT JOIN items i ON c.ide_col = i.ide_col " +
                "LEFT JOIN usuarios u ON c.ide_usu = u.ide_usu " +
                "WHERE c.publica = 1 " +
                "GROUP BY c.ide_col, c.nom_col, c.icono, c.publica, u.nom_usu " +
                "ORDER BY c.ide_col DESC"
            );
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Coleccion col = new Coleccion();
                col.setIdeCol(rs.getInt("ide_col"));
                col.setNomCol(rs.getString("nom_col"));
                col.setIcono(rs.getString("icono"));
                col.setPublica(rs.getBoolean("publica"));
                col.setImagenUrl(rs.getString("imagen_url"));
                col.setOwnerName(rs.getString("owner_name"));
                col.setTotalItems(rs.getInt("total_items"));
                col.setConseguidos(rs.getInt("conseguidos"));
                col.setDeseados(rs.getInt("deseados"));
                if (ideUsu > 0) {
                    ColeccionDownloadDAO dlDao = new ColeccionDownloadDAO();
                    col.setDescargada(dlDao.hasUserDownloaded(ideUsu, col.getIdeCol()));
                }
                list.add(col);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return list;
    }
}
