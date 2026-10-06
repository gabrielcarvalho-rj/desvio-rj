package com.desviorj.entity;


import jakarta.persistence.*;


@Entity
@Table(name = "interesses")
public class Interesse {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nome;



    public Interesse() {

    }



    public Interesse(String nome){

        this.nome = nome;

    }



    public Long getId() {
        return id;
    }



    public String getNome() {
        return nome;
    }



    public void setNome(String nome) {
        this.nome = nome;
    }

}