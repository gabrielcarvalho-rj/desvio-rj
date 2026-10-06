package com.desviorj.dto;


import java.time.LocalDateTime;

import com.desviorj.entity.Roteiro;


public class RoteiroResponse {


    private Long id;

    private String titulo;

    private String descricao;

    private boolean publico;

    private LocalDateTime criadoEm;

    private UsuarioResponse usuario;



    public RoteiroResponse(Roteiro roteiro){

        this.id = roteiro.getId();
        this.titulo = roteiro.getTitulo();
        this.descricao = roteiro.getDescricao();
        this.publico = roteiro.isPublico();
        this.criadoEm = roteiro.getCriadoEm();
        this.usuario = new UsuarioResponse(roteiro.getUsuario());

    }



    public Long getId() {
        return id;
    }


    public String getTitulo() {
        return titulo;
    }


    public String getDescricao() {
        return descricao;
    }


    public boolean isPublico() {
        return publico;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }


    public UsuarioResponse getUsuario() {
        return usuario;
    }

}