package com.collectiontracker.model;

public class Usuario {
    private int ideUsu;
    private String nomUsu;
    private String emailUsu;
    private String passUsu;
    private boolean baneado;
    private String fechaRegistro;
    
    public Usuario() {}

    public Usuario(int ideUsu, String nomUsu, String emailUsu, String passUsu, String fechaRegistro) {
        this.ideUsu = ideUsu;
        this.nomUsu = nomUsu;
        this.emailUsu = emailUsu;
        this.passUsu = passUsu;
        this.fechaRegistro = fechaRegistro;
    }

    public int getIdeUsu() { return ideUsu; }
    public void setIdeUsu(int ideUsu) { this.ideUsu = ideUsu; }
    public String getNomUsu() { return nomUsu; }
    public void setNomUsu(String nomUsu) { this.nomUsu = nomUsu; }
    public String getEmailUsu() { return emailUsu; }
    public void setEmailUsu(String emailUsu) { this.emailUsu = emailUsu; }
    public String getPassUsu() { return passUsu; }
    public void setPassUsu(String passUsu) { this.passUsu = passUsu; }
    public String getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(String fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public boolean isBaneado() { return baneado; }
    public void setBaneado(boolean baneado) { this.baneado = baneado; }
}
