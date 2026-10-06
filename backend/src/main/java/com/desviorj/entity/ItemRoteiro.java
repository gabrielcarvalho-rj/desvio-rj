package com.desviorj.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "itens_roteiro")
public class ItemRoteiro {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String horario;


    private String observacao;



    @ManyToOne
    @JoinColumn(name = "roteiro_id")
    private Roteiro roteiro;



    @ManyToOne
    @JoinColumn(name = "lugar_id")
    private Lugar lugar;




    public ItemRoteiro() {

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getHorario() {
        return horario;
    }


    public void setHorario(String horario) {
        this.horario = horario;
    }


    public String getObservacao() {
        return observacao;
    }


    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }


    public Roteiro getRoteiro() {
        return roteiro;
    }


    public void setRoteiro(Roteiro roteiro) {
        this.roteiro = roteiro;
    }


    public Lugar getLugar() {
        return lugar;
    }


    public void setLugar(Lugar lugar) {
        this.lugar = lugar;
    }

}