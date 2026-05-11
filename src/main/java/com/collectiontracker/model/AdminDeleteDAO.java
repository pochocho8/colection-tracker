package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class AdminDeleteDAO {
    
    public boolean deleteCollection(int ideCol) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            
            conn.setAutoCommit(false);
            try {
                PreparedStatement stmt = conn.prepareStatement(
                    "DELETE FROM colecciones WHERE ide_col = ?"
                );
                stmt.setInt(1, ideCol);
                int rows = stmt.executeUpdate();
                result = rows > 0;
                
                conn.commit();
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
        return result;
    }
    
    public boolean banUser(int ideUsu) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            
            conn.setAutoCommit(false);
            try {
                PreparedStatement stmtDeleteColecciones = conn.prepareStatement(
                    "DELETE FROM colecciones WHERE ide_usu = ?"
                );
                stmtDeleteColecciones.setInt(1, ideUsu);
                stmtDeleteColecciones.executeUpdate();
                
                PreparedStatement stmtBanUser = conn.prepareStatement(
                    "UPDATE usuarios SET baneado = 1 WHERE ide_usu = ?"
                );
                stmtBanUser.setInt(1, ideUsu);
                int rows = stmtBanUser.executeUpdate();
                result = rows > 0;
                
                conn.commit();
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
        return result;
    }
    
    public boolean unbanUser(int ideUsu) {
        boolean result = false;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "UPDATE usuarios SET baneado = 0 WHERE ide_usu = ?"
            );
            stmt.setInt(1, ideUsu);
            int rows = stmt.executeUpdate();
            result = rows > 0;
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}