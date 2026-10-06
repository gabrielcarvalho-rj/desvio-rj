package com.desviorj.entity;


import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
public class Dica {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String titulo;


    @Column(length = 1000)
    private String texto;


    // Avaliacao de 1 a 5 estrelas (inteiro, sem meia estrela)
    @Column(nullable = false)
    private Integer nota;


    private LocalDateTime criadoEm;



    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;



    @ManyToOne
    @JoinColumn(name = "lugar_id")
    private Lugar lugar;




    @PrePersist
    public void criarData(){

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


    public String getTexto() {
        return texto;
    }


    public void setTexto(String texto) {
        this.texto = texto;
    }


    public Integer getNota() {
        return nota;
    }


    public void setNota(Integer nota) {
        this.nota = nota;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }


    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }


    public Usuario getUsuario() {
        return usuario;
    }


    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }


    public Lugar getLugar() {
        return lugar;
    }


    public void setLugar(Lugar lugar) {
        this.lugar = lugar;
    }

}