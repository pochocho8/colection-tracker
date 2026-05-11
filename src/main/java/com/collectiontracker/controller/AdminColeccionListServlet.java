package com.collectiontracker.controller;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.AdminColeccionListDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/admin/colecciones")
public class AdminColeccionListServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
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
            
            AdminColeccionListDAO dao = new AdminColeccionListDAO();
            List<Coleccion> colecciones = dao.getAllPublicCollections();
            
            Map<String, Object> res = new HashMap<>();
            res.put("ok", true);
            res.put("colecciones", colecciones);
            res.put("total", colecciones.size());
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