package com.collectiontracker.controller;

import com.collectiontracker.model.AdminDeleteDAO;
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

@WebServlet("/api/admin/usuarios/ban")
public class AdminUsuarioBanServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();
        
        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "No autenticado");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            String email = (String) session.getAttribute("email");
            if (email == null || !email.toLowerCase().endsWith("@admin.com")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Acceso denegado");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            Map<String, Object> data = gson.fromJson(sb.toString(), Map.class);
            Number userIdNum = (Number) data.get("userId");
            Integer userId = userIdNum != null ? userIdNum.intValue() : null;
            
            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Falta el parametro userId");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            AdminDeleteDAO dao = new AdminDeleteDAO();
            boolean result = dao.banUser(userId);
            
            Map<String, Object> res = new HashMap<>();
            res.put("ok", result);
            res.put("mensaje", result ? "Usuario baneado y colecciones eliminadas" : "Error al banear");
            response.getWriter().write(gson.toJson(res));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> res = new HashMap<>();
            res.put("ok", false);
            res.put("mensaje", "Error: " + e.getMessage());
            response.getWriter().write(gson.toJson(res));
        }
    }
}