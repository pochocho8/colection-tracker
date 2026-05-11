package com.collectiontracker.controller;

import com.collectiontracker.model.ItemUpdateDAO;
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

@WebServlet("/api/items/update")
public class ItemUpdateServlet extends HttpServlet {
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
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
            
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            Map<String, Object> data = gson.fromJson(sb.toString(), Map.class);
            
            String estado = data.get("estado") != null ? data.get("estado").toString() : null;
            if (estado == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Falta el campo estado");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            int ideItem = Integer.parseInt(idParam);
            int userId = (int) session.getAttribute("userId");
            
            ItemUpdateDAO dao = new ItemUpdateDAO();
            boolean result = dao.updateItem(ideItem, estado, userId);
            
            Map<String, Object> res = new HashMap<>();
            res.put("ok", result);
            res.put("mensaje", result ? "Item actualizado" : "Error al actualizar");
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
