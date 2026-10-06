package com.desviorj.dto;


import com.desviorj.entity.Lugar;


public class LugarResponse {


    private Long id;

    private String nome;

    private String descricao;

    private String cidade;

    private String bairro;

    private String endereco;

    private String latitude;

    private String longitude;

    private String fotoUrl;

    private boolean gratuito;

    private double precoInicial;

    private int duracaoMinutos;

    private String dificuldade;

    private String siteExterno;

    private CategoriaResponse categoria;



    public LugarResponse(Lugar lugar){

        this.id = lugar.getId();
        this.nome = lugar.getNome();
        this.descricao = lugar.getDescricao();
        this.cidade = lugar.getCidade();
        this.bairro = lugar.getBairro();
        this.endereco = lugar.getEndereco();
        this.latitude = lugar.getLatitude();
        this.longitude = lugar.getLongitude();
        this.fotoUrl = lugar.getFotoUrl();
        this.gratuito = lugar.isGratuito();
        this.precoInicial = lugar.getPrecoInicial() != null
                ? lugar.getPrecoInicial()
                : 0.0;
        this.duracaoMinutos = lugar.getDuracaoMinutos() != null
                ? lugar.getDuracaoMinutos()
                : 0;
        this.dificuldade = lugar.getDificuldade();
        this.siteExterno = lugar.getSiteExterno();


        if(lugar.getCategoria() != null){

            this.categoria = new CategoriaResponse(
                    lugar.getCategoria()
            );

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


    public String getCidade() {
        return cidade;
    }


    public String getBairro() {
        return bairro;
    }


    public String getEndereco() {
        return endereco;
    }


    public String getLatitude() {
        return latitude;
    }


    public String getLongitude() {
        return longitude;
    }


    public String getFotoUrl() {
        return fotoUrl;
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


    public String getSiteExterno() {
        return siteExterno;
    }


    public CategoriaResponse getCategoria() {
        return categoria;
    }

}