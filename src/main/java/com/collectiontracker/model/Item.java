package com.collectiontracker.model;

public class Item {
    private int ideItem;
    private int ideCol;
    private String nomItem;
    private String estado;
    private String imagenUrl;
    private String observaciones;

    public Item() {
    }

    public Item(int ideItem, int ideCol, String nomItem, String estado, String imagenUrl) {
        this.ideItem = ideItem;
        this.ideCol = ideCol;
        this.nomItem = nomItem;
        this.estado = estado;
        this.imagenUrl = imagenUrl;
    }

    public int getIdeItem() {
        return ideItem;
    }

    public void setIdeItem(int ideItem) {
        this.ideItem = ideItem;
    }

    public int getIdeCol() {
        return ideCol;
    }

    public void setIdeCol(int ideCol) {
        this.ideCol = ideCol;
    }

    public String getNomItem() {
        return nomItem;
    }

    public void setNomItem(String nomItem) {
        this.nomItem = nomItem;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
