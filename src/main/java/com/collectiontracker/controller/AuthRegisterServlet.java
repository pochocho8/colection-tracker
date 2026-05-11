package com.collectiontracker.controller;

import com.collectiontracker.model.Usuario;
import com.collectiontracker.model.UsuarioRegisterDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/register")
public class AuthRegisterServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
        Gson gson = new Gson();
        Map<String, Object> data = gson.fromJson(sb.toString(), Map.class);
            
            String username = data.get("username") != null ? data.get("username").toString() : null;
            String email = data.get("email") != null ? data.get("email").toString() : null;
            String password = data.get("password") != null ? data.get("password").toString() : null;
            
            if (username == null || email == null || password == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Faltan campos obligatorios");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            UsuarioRegisterDAO dao = new UsuarioRegisterDAO();
            Usuario usuario = dao.register(username, email, password);
            
            if (usuario != null) {
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", usuario.getIdeUsu());
                session.setAttribute("username", usuario.getNomUsu());
                
                Map<String, Object> res = new HashMap<>();
                res.put("ok", true);
                res.put("usuario", usuario);
                response.getWriter().write(gson.toJson(res));
            } else {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "El usuario ya existe");
                response.getWriter().write(gson.toJson(res));
            }
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate")) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "El nombre de usuario o email ya existe");
                response.getWriter().write(new Gson().toJson(res));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Error: " + e.getMessage());
                response.getWriter().write(new Gson().toJson(res));
            }
        }
    }
}
