package com.desviorj.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.dto.DicaResponse;
import com.desviorj.entity.Dica;
import com.desviorj.service.DicaService;

@RestController
@RequestMapping("/dicas")
@CrossOrigin("*")
public class DicaController {

    private final DicaService service;

    public DicaController(DicaService service){

        this.service = service;

    }

    @PostMapping("/{usuarioId}/{lugarId}")
    public ResponseEntity<DicaResponse> criar(

            @PathVariable Long usuarioId,
            @PathVariable Long lugarId,

            @RequestParam(required = false) Integer nota,
            @RequestParam String titulo,
            @RequestParam String texto

    ){

        Dica dica = service.criar(
                usuarioId,
                lugarId,
                nota,
                titulo,
                texto
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new DicaResponse(dica)
                );

    }

    /**
     * GET /dicas            -> todas as dicas
     * GET /dicas?lugarId=1  -> somente as dicas do lugar
     */
    @GetMapping
    public List<DicaResponse> listar(
            @RequestParam(required = false) Long lugarId
    ){

        return service.listar(lugarId)
                .stream()
                .map(DicaResponse::new)
                .toList();

    }

}
