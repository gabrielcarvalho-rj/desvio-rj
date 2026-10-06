package com.desviorj.dto;

import com.desviorj.entity.Lugar;

public class LugarResumoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private String fotoUrl;
    private String bairro;
    private String cidade;
    private String categoria;
    private boolean gratuito;
    private double precoInicial;
    private int duracaoMinutos;
    private String dificuldade;

    public LugarResumoResponse(Lugar lugar){

        this.id = lugar.getId();
        this.nome = lugar.getNome();
        this.descricao = lugar.getDescricao();
        this.fotoUrl = lugar.getFotoUrl();
        this.bairro = lugar.getBairro();
        this.cidade = lugar.getCidade();
        this.gratuito = lugar.isGratuito();
        this.precoInicial = lugar.getPrecoInicial() != null
                ? lugar.getPrecoInicial()
                : 0.0;
        this.duracaoMinutos = lugar.getDuracaoMinutos() != null
                ? lugar.getDuracaoMinutos()
                : 0;
        this.dificuldade = lugar.getDificuldade();

        if(lugar.getCategoria() != null){
            this.categoria = lugar.getCategoria().getNome();
        }

    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getCategoria() {
        return categoria;
    }

    public boolean isGratuito() {
        return gratuito;
    }

    public double getPrecoInicial() {
        return precoInicial;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public String getDificuldade() {
        return dificuldade;
    }

}
