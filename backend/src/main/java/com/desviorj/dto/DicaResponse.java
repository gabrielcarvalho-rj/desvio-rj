package com.desviorj.dto;


import java.time.LocalDateTime;

import com.desviorj.entity.Dica;


public class DicaResponse {


    private Long id;

    private String titulo;

    private String texto;

    private Integer nota;

    private LocalDateTime criadoEm;

    private UsuarioResponse usuario;

    private LugarResumoResponse lugar;



    public DicaResponse(Dica dica){

        this.id = dica.getId();
        this.titulo = dica.getTitulo();
        this.texto = dica.getTexto();
        this.nota = dica.getNota();
        this.criadoEm = dica.getCriadoEm();

        if(dica.getUsuario() != null){
            this.usuario = new UsuarioResponse(dica.getUsuario());
        }

        if(dica.getLugar() != null){
            this.lugar = new LugarResumoResponse(dica.getLugar());
        }

    }


    public Long getId() {
        return id;
    }


    public String getTitulo() {
        return titulo;
    }


    public String getTexto() {
        return texto;
    }


    public Integer getNota() {
        return nota;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }


    public UsuarioResponse getUsuario() {
        return usuario;
    }


    public LugarResumoResponse getLugar() {
        return lugar;
    }

}