package com.collectiontracker.model;

public class Item {
    private int ideItem;
    private int ideCol;
    private String nomItem;
    private String estado;

    public Item() {
    }

    public Item(int ideItem, int ideCol, String nomItem, String estado) {
        this.ideItem = ideItem;
        this.ideCol = ideCol;
        this.nomItem = nomItem;
        this.estado = estado;
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
}
