package com.collectiontracker.model;

public class AdminHelper {
    
    public static boolean isAdmin(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return email.toLowerCase().endsWith("@admin.com");
    }
    
    public static boolean isBanned(int ideUsu) {
        try (java.sql.Connection conn = ConexionBD.getConnection();
             java.sql.PreparedStatement stmt = conn.prepareStatement(
                 "SELECT baneado FROM usuarios WHERE ide_usu = ?"
             )) {
            stmt.setInt(1, ideUsu);
            try (java.sql.ResultSet rs = stmt.executeQuery()) {
                return rs.next() && rs.getBoolean("baneado");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}