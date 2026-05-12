package com.collectiontracker.model;

import com.collectiontracker.model.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class AdminUsuarioListDAO {
    
    public List<Usuario> getAllBannedUsers() {
        List<Usuario> list = new ArrayList<>();
        try {
            Connection conn = ConexionBD.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT ide_usu, nom_usu FROM usuarios WHERE baneado = 1 ORDER BY ide_usu DESC"
            );
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setIdeUsu(rs.getInt("ide_usu"));
                usuario.setNomUsu(rs.getString("nom_usu"));
                list.add(usuario);
            }
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return list;
    }
}