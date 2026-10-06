package com.desviorj.dto;

import com.desviorj.entity.Usuario;

import java.time.LocalDateTime;

public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private String role;
    private boolean moradorRio;
    private LocalDateTime criadoEm;


    public UsuarioResponse(Usuario usuario) {

        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.role = usuario.getRole();
        this.moradorRio = usuario.isMoradorRio();
        this.criadoEm = usuario.getCriadoEm();

    }


    public Long getId() {
        return id;
    }


    public String getNome() {
        return nome;
    }


    public String getEmail() {
        return email;
    }


    public String getRole() {
        return role;
    }


    public boolean isMoradorRio() {
        return moradorRio;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

}