package com.desviorj.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.entity.Roteiro;
import com.desviorj.service.RoteiroService;
import com.desviorj.dto.RoteiroResponse;



@RestController
@RequestMapping("/roteiros")
@CrossOrigin("*")
public class RoteiroController {



    private final RoteiroService service;



    public RoteiroController(
            RoteiroService service
    ) {

        this.service = service;

    }




    @PostMapping("/{usuarioId}")
    public ResponseEntity<RoteiroResponse> criar(
            @PathVariable Long usuarioId,
            @RequestParam String titulo,
            @RequestParam(required = false, defaultValue = "") String descricao,
            @RequestParam(required = false, defaultValue = "false") boolean publico
    ) {


        Roteiro roteiro = service.criar(
                usuarioId,
                titulo,
                descricao,
                publico
        );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    new RoteiroResponse(roteiro)
                );

    }




    @GetMapping("/usuario/{usuarioId}")
    public List<RoteiroResponse> listar(
            @PathVariable Long usuarioId
    ) {


        return service.listarUsuario(usuarioId)
                .stream()
                .map(RoteiroResponse::new)
                .toList();

    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RoteiroResponse> buscar(
            @PathVariable Long id
    ) {

        Roteiro roteiro = service.buscar(id);

        return ResponseEntity.ok(
                new RoteiroResponse(roteiro)
        );
    }


}