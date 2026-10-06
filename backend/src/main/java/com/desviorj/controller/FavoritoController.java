package com.desviorj.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.entity.Favorito;
import com.desviorj.service.FavoritoService;
import com.desviorj.dto.FavoritoResponse;



@RestController
@RequestMapping("/favoritos")
@CrossOrigin("*")
public class FavoritoController {



    private final FavoritoService service;



    public FavoritoController(
            FavoritoService service
    ) {

        this.service = service;

    }




    @PostMapping("/{usuarioId}/{lugarId}")
    public ResponseEntity<FavoritoResponse> adicionar(
            @PathVariable Long usuarioId,
            @PathVariable Long lugarId
    ) {

        Favorito favorito = service.adicionar(usuarioId, lugarId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    new FavoritoResponse(favorito)
                );

    }





    @GetMapping("/{usuarioId}")
    public List<FavoritoResponse> listar(
            @PathVariable Long usuarioId
    ) {

        return service.listar(usuarioId)
                .stream()
                .map(FavoritoResponse::new)
                .toList();

    }





    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @PathVariable Long id
    ) {

        service.remover(id);

        return ResponseEntity
                .noContent()
                .build();

    }


}