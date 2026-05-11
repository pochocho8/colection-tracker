package com.collectiontracker.controller;

import com.collectiontracker.model.Item;
import com.collectiontracker.model.ItemCreateDAO;
import com.collectiontracker.model.ColeccionGetDAO;
import com.collectiontracker.model.Coleccion;
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

@WebServlet("/api/items/create")
public class ItemCreateServlet extends HttpServlet {
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
            
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            Map<String, Object> data = gson.fromJson(sb.toString(), Map.class);
            
            Object coleccionObj = data.get("coleccion");
            Object nombreObj = data.get("nombre");
            Object estadoObj = data.get("estado");
            
            if (coleccionObj == null || nombreObj == null || nombreObj.toString().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Faltan campos obligatorios");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            int ideCol = ((Number) data.get("coleccion")).intValue();
            int ideUsu = (int) session.getAttribute("userId");
            
            ColeccionGetDAO colDao = new ColeccionGetDAO();
            Coleccion col = colDao.getCollection(ideCol, ideUsu);
            
            if (col == null) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Coleccion no pertenece al usuario");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            String nombre = nombreObj != null ? nombreObj.toString() : "";
            String estado = estadoObj != null ? estadoObj.toString() : "ninguno";
            
            ItemCreateDAO dao = new ItemCreateDAO();
            Item item = dao.createItem(ideCol, nombre, estado);
            
            if (item != null) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", true);
                res.put("item", item);
                response.getWriter().write(gson.toJson(res));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Error al crear el item");
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
