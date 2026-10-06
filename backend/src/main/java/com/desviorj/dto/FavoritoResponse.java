package com.desviorj.dto;

import com.desviorj.entity.Favorito;

public class FavoritoResponse {

    private Long id;
    private LugarResumoResponse lugar;

    public FavoritoResponse(Favorito favorito) {
        this.id = favorito.getId();
        this.lugar = new LugarResumoResponse(favorito.getLugar());
    }

    public Long getId() {
        return id;
    }

    public LugarResumoResponse getLugar() {
        return lugar;
    }
}