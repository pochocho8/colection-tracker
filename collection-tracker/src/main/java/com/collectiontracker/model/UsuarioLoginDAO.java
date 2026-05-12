package com.collectiontracker.model;

import com.collectiontracker.model.Usuario;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.util.Base64;

public class UsuarioLoginDAO {
    public Usuario authenticate(String username, String password) {
        Usuario usuario = null;
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT * FROM usuarios WHERE nom_usu = ?"
            );
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String storedHash = rs.getString("pass_usu");
                boolean banned = rs.getBoolean("baneado");
                if (banned) {
                    conn.close();
                    return null;
                }
                if (verifyPassword(password, storedHash)) {
                    usuario = new Usuario();
                    usuario.setIdeUsu(rs.getInt("ide_usu"));
                    usuario.setNomUsu(rs.getString("nom_usu"));
                    usuario.setEmailUsu(rs.getString("email_usu"));
                    usuario.setFechaRegistro(rs.getString("fecha_registro"));
                    usuario.setBaneado(banned);
                }
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return usuario;
    }
    
    private boolean verifyPassword(String password, String stored) throws Exception {
        String[] parts = stored.split(":");
        byte[] salt = Base64.getDecoder().decode(parts[0]);
        byte[] hash = Base64.getDecoder().decode(parts[1]);
        
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 256);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] testHash = skf.generateSecret(spec).getEncoded();
        
        return java.util.Arrays.equals(hash, testHash);
    }
}
