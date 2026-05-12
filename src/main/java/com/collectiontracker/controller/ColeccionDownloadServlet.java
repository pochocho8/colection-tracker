package com.collectiontracker.controller;

import com.collectiontracker.model.Coleccion;
import com.collectiontracker.model.ColeccionDownloadDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/api/colecciones/download")
public class ColeccionDownloadServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        Gson gson = new Gson();
        
        try {
            Integer userId = (Integer) req.getSession().getAttribute("userId");
            if (userId == null) {
                String json = gson.toJson(new RespuestaDownload(false, null, "No autenticado"));
                resp.getWriter().write(json);
                return;
            }
            
            String idParam = req.getParameter("id");
            if (idParam == null || idParam.isEmpty()) {
                String json = gson.toJson(new RespuestaDownload(false, null, "ID requerido"));
                resp.getWriter().write(json);
                return;
            }
            
            int ideColOriginal = Integer.parseInt(idParam);
            
            ColeccionDownloadDAO dao = new ColeccionDownloadDAO();
            
            if (dao.hasUserDownloaded(userId, ideColOriginal)) {
                int ideColCopia = dao.getDownloadedCollectionId(userId, ideColOriginal);
                String json = gson.toJson(new RespuestaDownload(true, ideColCopia, "Ya descargada"));
                resp.getWriter().write(json);
                return;
            }
            
            Coleccion colCopia = dao.downloadCollection(userId, ideColOriginal);
            
            if (colCopia != null) {
                String json = gson.toJson(new RespuestaDownload(true, colCopia.getIdeCol(), "Descarga exitosa"));
                resp.getWriter().write(json);
            } else {
                String json = gson.toJson(new RespuestaDownload(false, null, "Error al descargar"));
                resp.getWriter().write(json);
            }
            
        } catch (Exception e) {
            String json = gson.toJson(new RespuestaDownload(false, null, e.getMessage()));
            resp.getWriter().write(json);
        }
    }
    
    private static class RespuestaDownload {
        boolean ok;
        Integer collectionId;
        String mensaje;
        
        RespuestaDownload(boolean ok, Integer collectionId, String mensaje) {
            this.ok = ok;
            this.collectionId = collectionId;
            this.mensaje = mensaje;
        }
    }
}
