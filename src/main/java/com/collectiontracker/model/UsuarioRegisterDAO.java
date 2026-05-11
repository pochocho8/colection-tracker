package com.collectiontracker.model;

import com.collectiontracker.model.Usuario;
import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.util.Base64;
import java.security.SecureRandom;

public class UsuarioRegisterDAO {
    public Usuario register(String username, String email, String password) {
        Usuario usuario = null;
        try {
            String hashedPassword = hashPassword(password);
            
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO usuarios (nom_usu, email_usu, pass_usu) VALUES (?, ?, ?)",
                PreparedStatement.RETURN_GENERATED_KEYS
            );
            stmt.setString(1, username);
            stmt.setString(2, email);
            stmt.setString(3, hashedPassword);
            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                usuario = new Usuario();
                usuario.setIdeUsu(rs.getInt(1));
                usuario.setNomUsu(username);
                usuario.setEmailUsu(email);
                usuario.setFechaRegistro(java.time.LocalDateTime.now().toString());
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return usuario;
    }
    
    private String hashPassword(String password) throws Exception {
        SecureRandom sr = new SecureRandom();
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 256);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] hash = skf.generateSecret(spec).getEncoded();
        
        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
    }
}
