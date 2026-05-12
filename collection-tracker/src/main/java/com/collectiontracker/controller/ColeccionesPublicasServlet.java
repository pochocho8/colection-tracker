package com.collectiontracker.controller;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ColeccionListDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/colecciones/publicas")
public class ColeccionesPublicasServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        Gson gson = new Gson();
        
        try {
            ColeccionListDAO dao = new ColeccionListDAO();
            List<Coleccion> colecciones = dao.getPublicCollections();
            
            String json = gson.toJson(new RespuestaPublicas(true, colecciones, colecciones.size()));
            resp.getWriter().write(json);
            
        } catch (Exception e) {
            String json = gson.toJson(new RespuestaPublicas(false, null, 0, e.getMessage()));
            resp.getWriter().write(json);
        }
    }
    
    private static class RespuestaPublicas {
        boolean ok;
        List<Coleccion> colecciones;
        int total;
        String mensaje;
        
        RespuestaPublicas(boolean ok, List<Coleccion> colecciones, int total) {
            this.ok = ok;
            this.colecciones = colecciones;
            this.total = total;
        }
        
        RespuestaPublicas(boolean ok, List<Coleccion> colecciones, int total, String mensaje) {
            this.ok = ok;
            this.colecciones = colecciones;
            this.total = total;
            this.mensaje = mensaje;
        }
    }
}
