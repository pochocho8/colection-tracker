package com.collectiontracker.controller;

import com.collectiontracker.model.ColeccionUpdateDAO;
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

@WebServlet("/api/colecciones/update")
public class ColeccionUpdateServlet extends HttpServlet {
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
            
            String nombre = data.get("nombre") != null ? data.get("nombre").toString() : null;
            String icono = data.get("icono") != null ? data.get("icono").toString() : null;
            String imagenUrl = data.get("imagenUrl") != null ? data.get("imagenUrl").toString() : null;
            Object publicaObj = data.get("publica");
            boolean publica = publicaObj != null && (publicaObj.equals(true) || publicaObj.equals(1.0) || publicaObj.toString().equals("true"));
            
            int ideCol = Integer.parseInt(idParam);
            int ideUsu = (int) session.getAttribute("userId");
            if (icono == null) icono = "star";
            
            ColeccionUpdateDAO dao = new ColeccionUpdateDAO();
            boolean result;
            if (imagenUrl != null) {
                result = dao.updateCollectionImage(ideCol, ideUsu, imagenUrl);
            } else {
                if (nombre == null || nombre.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, Object> res = new HashMap<>();
                    res.put("ok", false);
                    res.put("mensaje", "El nombre es obligatorio");
                    response.getWriter().write(gson.toJson(res));
                    return;
                }
                result = dao.updateCollection(ideCol, ideUsu, nombre, icono, publica);
            }
            
            Map<String, Object> res = new HashMap<>();
            res.put("ok", result);
            res.put("mensaje", result ? "Coleccion actualizada" : "Error al actualizar");
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
