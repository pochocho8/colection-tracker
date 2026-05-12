package com.collectiontracker.controller;

import com.collectiontracker.model.Usuario;
import com.collectiontracker.model.UsuarioLoginDAO;
import com.collectiontracker.model.AdminHelper;
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

@WebServlet("/api/auth/login")
public class AuthLoginServlet extends HttpServlet {
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
            String password = data.get("password") != null ? data.get("password").toString() : null;
            
            if (username == null || password == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Faltan campos obligatorios");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            UsuarioLoginDAO dao = new UsuarioLoginDAO();
            Usuario usuario = dao.authenticate(username, password);
            
            if (usuario != null) {
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", usuario.getIdeUsu());
                session.setAttribute("username", usuario.getNomUsu());
                session.setAttribute("email", usuario.getEmailUsu());
                
                boolean esAdmin = AdminHelper.isAdmin(usuario.getEmailUsu());
                
                Map<String, Object> res = new HashMap<>();
                res.put("ok", true);
                res.put("usuario", usuario);
                res.put("esAdmin", esAdmin);
                response.getWriter().write(gson.toJson(res));
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Credenciales incorrectas o cuenta suspendida");
                response.getWriter().write(gson.toJson(res));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> res = new HashMap<>();
            res.put("ok", false);
            res.put("mensaje", "Error: " + e.getMessage());
            response.getWriter().write(new Gson().toJson(res));
        }
    }
}
