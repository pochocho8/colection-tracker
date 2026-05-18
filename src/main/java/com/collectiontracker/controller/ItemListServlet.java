package com.collectiontracker.controller;

import com.collectiontracker.model.Item;
import com.collectiontracker.model.ItemListDAO;
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
import java.util.List;
import java.util.Map;

@WebServlet("/api/items/list")
public class ItemListServlet extends HttpServlet {
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
                res.put("mensaje", "Debes iniciar sesion");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            int ideUsu = (int) session.getAttribute("userId");
            
            String coleccionParam = request.getParameter("coleccion");
            if (coleccionParam == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "Falta el parametro coleccion");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            int ideCol = Integer.parseInt(coleccionParam);
            
            ColeccionGetDAO colDao = new ColeccionGetDAO();
            boolean isOwner = colDao.isOwner(ideCol, ideUsu);
            
            if (!isOwner) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                Map<String, Object> res = new HashMap<>();
                res.put("ok", false);
                res.put("mensaje", "No tienes acceso a esta coleccion");
                response.getWriter().write(gson.toJson(res));
                return;
            }
            
            ItemListDAO dao = new ItemListDAO();
            List<Item> items = dao.getItemsByCollection(ideCol, ideUsu);
            
            Map<String, Object> res = new HashMap<>();
            res.put("ok", true);
            res.put("items", items);
            res.put("total", items.size());
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
