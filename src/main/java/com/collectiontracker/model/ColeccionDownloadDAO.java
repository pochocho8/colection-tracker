package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import com.collectiontracker.model.Coleccion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ColeccionDownloadDAO {
    
    public boolean hasUserDownloaded(int ideUsu, int ideColOriginal) {
        boolean downloaded = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT 1 FROM colecciones_descargas WHERE ide_usu = ? AND ide_col_original = ?"
            );
            stmt.setInt(1, ideUsu);
            stmt.setInt(2, ideColOriginal);
            ResultSet rs = stmt.executeQuery();
            downloaded = rs.next();
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return downloaded;
    }
    
    public int getDownloadedCollectionId(int ideUsu, int ideColOriginal) {
        int ideColCopia = 0;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT ide_col_copia FROM colecciones_descargas WHERE ide_usu = ? AND ide_col_original = ?"
            );
            stmt.setInt(1, ideUsu);
            stmt.setInt(2, ideColOriginal);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ideColCopia = rs.getInt("ide_col_copia");
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ideColCopia;
    }
    
    public Coleccion downloadCollection(int ideUsu, int ideColOriginal) {
        Coleccion colCopia = null;
        try {
            Connection conn = ConexionBD.getConnection();
            conn.setAutoCommit(false);
            
            try {
                PreparedStatement stmtOrig = conn.prepareStatement(
                    "SELECT nom_col, icono, imagen_url FROM colecciones WHERE ide_col = ? AND publica = 1"
                );
                stmtOrig.setInt(1, ideColOriginal);
                ResultSet rsOrig = stmtOrig.executeQuery();
                
                if (!rsOrig.next()) {
                    throw new RuntimeException("Coleccion no encontrada o no es publica");
                }
                
                String nomCol = rsOrig.getString("nom_col");
                String icono = rsOrig.getString("icono");
                String imagenUrl = rsOrig.getString("imagen_url");
                
                PreparedStatement stmtInsert = conn.prepareStatement(
                    "INSERT INTO colecciones (ide_usu, nom_col, icono, publica, imagen_url) VALUES (?, ?, ?, 0, ?)",
                    PreparedStatement.RETURN_GENERATED_KEYS
                );
                stmtInsert.setInt(1, ideUsu);
                stmtInsert.setString(2, nomCol);
                stmtInsert.setString(3, icono);
                if (imagenUrl != null) {
                    stmtInsert.setString(4, imagenUrl);
                } else {
                    stmtInsert.setNull(4, java.sql.Types.VARCHAR);
                }
                stmtInsert.executeUpdate();
                
                ResultSet rsKeys = stmtInsert.getGeneratedKeys();
                int ideColCopia = 0;
                if (rsKeys.next()) {
                    ideColCopia = rsKeys.getInt(1);
                }
                
                PreparedStatement stmtItems = conn.prepareStatement(
                    "SELECT nom_item, estado, imagen_url, observaciones FROM items WHERE ide_col = ?"
                );
                stmtItems.setInt(1, ideColOriginal);
                ResultSet rsItems = stmtItems.executeQuery();
                
                PreparedStatement stmtInsertItem = conn.prepareStatement(
                    "INSERT INTO items (ide_col, nom_item, estado, imagen_url, observaciones) VALUES (?, ?, ?, ?, ?)"
                );
                
                while (rsItems.next()) {
                    stmtInsertItem.setInt(1, ideColCopia);
                    stmtInsertItem.setString(2, rsItems.getString("nom_item"));
                    stmtInsertItem.setString(3, rsItems.getString("estado"));
                    String imgUrl = rsItems.getString("imagen_url");
                    if (imgUrl != null) {
                        stmtInsertItem.setString(4, imgUrl);
                    } else {
                        stmtInsertItem.setNull(4, java.sql.Types.VARCHAR);
                    }
                    String obs = rsItems.getString("observaciones");
                    if (obs != null) {
                        stmtInsertItem.setString(5, obs);
                    } else {
                        stmtInsertItem.setNull(5, java.sql.Types.VARCHAR);
                    }
                    stmtInsertItem.executeUpdate();
                }
                
                PreparedStatement stmtDescarga = conn.prepareStatement(
                    "INSERT INTO colecciones_descargas (ide_usu, ide_col_original, ide_col_copia) VALUES (?, ?, ?)"
                );
                stmtDescarga.setInt(1, ideUsu);
                stmtDescarga.setInt(2, ideColOriginal);
                stmtDescarga.setInt(3, ideColCopia);
                stmtDescarga.executeUpdate();
                
                conn.commit();
                
                colCopia = new Coleccion();
                colCopia.setIdeCol(ideColCopia);
                colCopia.setNomCol(nomCol);
                colCopia.setIcono(icono);
                colCopia.setPublica(false);
                colCopia.setTotalItems(0);
                colCopia.setConseguidos(0);
                colCopia.setDeseados(0);
                
            } catch (Exception e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
                conn.close();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return colCopia;
    }
}
