package com.desviorj.dto;


import com.desviorj.entity.ItemRoteiro;


public class ItemRoteiroResponse {


    private Long id;

    private String horario;

    private String observacao;

    private RoteiroResponse roteiro;

    private LugarResumoResponse lugar;



    public ItemRoteiroResponse(ItemRoteiro item){

        this.id = item.getId();
        this.horario = item.getHorario();
        this.observacao = item.getObservacao();

        this.roteiro = new RoteiroResponse(
                item.getRoteiro()
        );

        this.lugar = new LugarResumoResponse(
                item.getLugar()
        );

    }



    public Long getId() {
        return id;
    }


    public String getHorario() {
        return horario;
    }


    public String getObservacao() {
        return observacao;
    }


    public RoteiroResponse getRoteiro() {
        return roteiro;
    }


    public LugarResumoResponse getLugar() {
        return lugar;
    }

}