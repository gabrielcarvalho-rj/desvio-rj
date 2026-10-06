package com.desviorj.dto;


import jakarta.validation.constraints.NotBlank;

public class LugarRequest {

    @NotBlank(message = "O nome do lugar é obrigatório")
    private String nome;

    private String descricao;

    private String cidade;

    private String bairro;

    private String endereco;

    private String latitude;

    private String longitude;

    private String fotoUrl;

    private boolean gratuito;

    private Double precoInicial;

    private Integer duracaoMinutos;

    private String dificuldade;

    private String siteExterno;

    private Long categoriaId;



    public String getNome() {
        return nome;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getDescricao() {
        return descricao;
    }


    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public String getCidade() {
        return cidade;
    }


    public void setCidade(String cidade) {
        this.cidade = cidade;
    }


    public String getBairro() {
        return bairro;
    }


    public void setBairro(String bairro) {
        this.bairro = bairro;
    }


    public String getEndereco() {
        return endereco;
    }


    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }


    public String getLatitude() {
        return latitude;
    }


    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }


    public String getLongitude() {
        return longitude;
    }


    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }


    public String getFotoUrl() {
        return fotoUrl;
    }


    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }


    public boolean isGratuito() {
        return gratuito;
    }


    public void setGratuito(boolean gratuito) {
        this.gratuito = gratuito;
    }


    public Double getPrecoInicial() {
        return precoInicial;
    }


    public void setPrecoInicial(Double precoInicial) {
        this.precoInicial = precoInicial;
    }


    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }


    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }


    public String getDificuldade() {
        return dificuldade;
    }


    public void setDificuldade(String dificuldade) {
        this.dificuldade = dificuldade;
    }


    public String getSiteExterno() {
        return siteExterno;
    }


    public void setSiteExterno(String siteExterno) {
        this.siteExterno = siteExterno;
    }


    public Long getCategoriaId() {
        return categoriaId;
    }


    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

}