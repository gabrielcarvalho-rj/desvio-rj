package com.desviorj.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "roteiros")
public class Roteiro {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String titulo;


    private String descricao;


    private boolean publico;


    private LocalDateTime criadoEm;



    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;




    public Roteiro() {

        criadoEm = LocalDateTime.now();

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getTitulo() {
        return titulo;
    }


    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }


    public String getDescricao() {
        return descricao;
    }


    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public boolean isPublico() {
        return publico;
    }


    public void setPublico(boolean publico) {
        this.publico = publico;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }


    public Usuario getUsuario() {
        return usuario;
    }


    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

}