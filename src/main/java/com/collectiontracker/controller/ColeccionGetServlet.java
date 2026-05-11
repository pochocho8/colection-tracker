package com.collectiontracker.controller;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ColeccionGetDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/colecciones/get")
public class ColeccionGetServlet extends HttpServlet {
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
            
            String idParam = request.getParameter("id");
            if (idParam == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Falta el parametro id");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            int ideCol = Integer.parseInt(idParam);
            int ideUsu = (int) session.getAttribute("userId");
            
            ColeccionGetDAO dao = new ColeccionGetDAO();
            Coleccion col = dao.getCollection(ideCol, ideUsu);
            boolean isOwner = dao.isOwner(ideCol, ideUsu);
            
            if (col != null) {
                Map<String, Object> res = new HashMap<>();
                res.put("ok", true);
                res.put("coleccion", col);
                res.put("isOwner", isOwner);
                response.getWriter().write(gson.toJson(res));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Coleccion no encontrada");
                response.getWriter().write(gson.toJson(res));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> res = new HashMap<>();
            res.put("ok", false);
            res.put("mensaje", "Error: " + e.getMessage());
            response.getWriter().write(gson.toJson(res));
        }
    }
}
