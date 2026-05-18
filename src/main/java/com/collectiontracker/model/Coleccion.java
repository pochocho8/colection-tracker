package com.collectiontracker.model;

public class Coleccion {
    private int ideCol;
    private String nomCol;
    private String icono;
    private boolean publica;
    private int totalItems;
    private int conseguidos;
    private int deseados;
    private String ownerName;
    private int ideUsu;
    private String imagenUrl;

    public Coleccion() {
    }

    public Coleccion(int ideCol, String nomCol, String icono) {
        this.ideCol = ideCol;
        this.nomCol = nomCol;
        this.icono = icono;
    }

    public int getIdeCol() {
        return ideCol;
    }

    public void setIdeCol(int ideCol) {
        this.ideCol = ideCol;
    }

    public String getNomCol() {
        return nomCol;
    }

    public void setNomCol(String nomCol) {
        this.nomCol = nomCol;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getConseguidos() {
        return conseguidos;
    }

    public void setConseguidos(int conseguidos) {
        this.conseguidos = conseguidos;
    }

    public int getDeseados() {
        return deseados;
    }

    public void setDeseados(int deseados) {
        this.deseados = deseados;
    }

    public boolean isPublica() {
        return publica;
    }

    public void setPublica(boolean publica) {
        this.publica = publica;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public int getIdeUsu() {
        return ideUsu;
    }
    
    public void setIdeUsu(int ideUsu) {
        this.ideUsu = ideUsu;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}
