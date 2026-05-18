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
    
    public Usuario registerOrUpdate(String username, String email, String password) {
        try {
            return register(username, email, password);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate")) {
                try {
                    String hashedPassword = hashPassword(password);
                    Connection conn = ConexionBD.getConnection();
                    PreparedStatement stmt = conn.prepareStatement(
                        "UPDATE usuarios SET pass_usu = ? WHERE nom_usu = ?"
                    );
                    stmt.setString(1, hashedPassword);
                    stmt.setString(2, username);
                    stmt.executeUpdate();
                    conn.close();
                    
                    conn = ConexionBD.getConnection();
                    stmt = conn.prepareStatement(
                        "SELECT ide_usu, nom_usu, email_usu, fecha_registro FROM usuarios WHERE nom_usu = ?"
                    );
                    stmt.setString(1, username);
                    ResultSet rs = stmt.executeQuery();
                    Usuario usuario = null;
                    if (rs.next()) {
                        usuario = new Usuario();
                        usuario.setIdeUsu(rs.getInt("ide_usu"));
                        usuario.setNomUsu(rs.getString("nom_usu"));
                        usuario.setEmailUsu(rs.getString("email_usu"));
                        usuario.setFechaRegistro(rs.getString("fecha_registro"));
                    }
                    conn.close();
                    return usuario;
                } catch (Exception e2) {
                    throw new RuntimeException(e2);
                }
            }
            throw new RuntimeException(e);
        }
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
